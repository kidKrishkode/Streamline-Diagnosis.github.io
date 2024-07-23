const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
const exec = require('child_process').exec;
const querystring = require('querystring');
const ejs = require('ejs');
const jsonfile = require('jsonfile');
require('./public/App.test.js');
require('dotenv').config();

const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5500;
const AppName = "Streamline Diagnosis";
let web = new WEB(PORT);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    try{
        const url = req.originalUrl;
        const query = url.split('?')[1];
        const params = (new URL(path.join(__dirname, url))).searchParams;
        const public_key = 13;
        if(params.has('encode')){
            if(query!=undefined){
                const decodedUrl = web.decodedURI(query.replace('encode=',''), public_key);
                req.url = `${url.split('?')[0]}?${decodedUrl}`;
                req.query = querystring.parse(decodedUrl);
            }
        }else{
            if(query!=undefined){
                const encodedUrl = web.encodedURI(query, public_key);
                req.url = `${url}?encode=${encodedUrl}`;
                req.query = querystring.parse(encodedUrl);
            }
        }
        next();
    }catch(e){
        res.status(401).render('notfound',{error: 401, message: "Unauthorize entry not allow, check the source or report it"});
    }
});

app.get('/', (req, res) => {
    res.status(200).render('index');
});

app.get('/diagnosis', async (req, res) => {
    productList = await web.ProductListMaker();
    res.status(200).render('diagnosis',{productList});
});

app.get('/diabetes', (req, res) => {
    const layout = undefined;
    const relatedDiagnosis = web.getRelatedDiagnosis('Diabetes').toString();
    res.status(200).render('diabetes',{layout, relatedDiagnosis});
});

app.get('/diabetes/predict', async (req, res) => {
    if(req.query.encode!=undefined){
        res.redirect('*');
    }
    try{
        const name = req.query.name;
        const age = web.getAge(req.query.age);
        const bp = req.query.bp * 1;
        const glu = req.query.glu * 1;
        const fru = req.query.fru * 1;
        const blv = req.query.blv * 1;
        const slh = req.query.slh * 1;
        const wl = req.query.wl * 1;
        const listOfInput = [age, bp, glu, fru, blv, slh, wl];
        if(listOfInput.length > 0){
            let new_fru = fru==0?'No':'Yes';
            let new_blv = blv==0?'No':'Yes';
            let new_slh = slh==0?'No':'Yes';
            let new_wl = wl==0?'No':'Yes';
            let feature = web.featureLayout(['Blood Pressure', 'Glucose Level', 'Frequent Urination', 'Blurred Vision', 'Slow Healing', 'Weight Loss'],[bp, glu, new_fru, new_blv, new_slh, new_wl],['mmHg','mg/dL',null,null,null,null]);
            await callPythonProcess(listOfInput, 'diabetes').then(results => {
                const result = web.targetLayout(['Result'],[results.value==0?'Negative (No Diabetes Detected)':'Positive (Diabetes Detected)']);
                ejs.renderFile('./views/output.ejs',{name, age, feature, result}).then(layout => {
                    res.status(200).render('diabetes',{layout});
                });
            }).catch(error => {
                console.error('Error:', error.message);
            });
        }
    }catch(e){
        console.log(">> Something wrong to process recent request!\n");
    }
});

app.get('/breastCancer', (req, res) => {
    const layout = undefined;
    const relatedDiagnosis = web.getRelatedDiagnosis('Breast Cancer').toString();
    res.status(200).render('breastCancer',{layout, relatedDiagnosis});
});

app.get('/breastCancer/predict', async (req, res) => {
    if(req.query.encode!=undefined){
        res.redirect('*');
    }
    try{
        const name = req.query.name;
        const age = web.getAge(req.query.age);
        const tuS = req.query.tus * 1;
        const brP = req.query.brp * 1;
        const blD = req.query.bld * 1;
        const sC = req.query.sc * 1;
        const fH = req.query.fh * 1;
        const listOfInput = [age, tuS, brP, blD, sC, fH];
        if(listOfInput.length > 0){
            let new_brP = brP==0?'No':'Yes';
            let new_blD = blD==0?'No':'Yes';
            let new_sC = sC==0?'No':'Yes';
            let new_fH = fH==0?'No':'Yes';
            let feature = web.featureLayout(['Tumor Size', 'Breast Pain', 'Blood Discharge', 'Shape Change', 'Family History'],[tuS, new_brP, new_blD, new_sC, new_fH],['cm',null,null,null,null]);
            await callPythonProcess(listOfInput, 'breastCancer').then(results => {
                const result = web.targetLayout(['Result','Type'],[results.value==0?'Negative (No Tumor Detected)':'Positive (Tumor Detected)',results.type==""?"Null":results.type]);
                ejs.renderFile('./views/output.ejs',{name, age, feature, result}).then(layout => {
                    res.status(200).render('breastCancer',{layout});
                });
            }).catch(error => {
                console.error('Error:', error.message);
            });
        }
    }catch(e){
        console.log(">> Something wrong to process recent request!\n");
    }
});
function WEB(port){
    this.active = true;
    this.port = port;
    this.filename = path.basename(__filename);
    this.hash = jsonfile.readFileSync('./public/manifest.json')['hash'];
    this.antihash = jsonfile.readFileSync('./public/manifest.json')['antihash'];
}

WEB.prototype.getAge = function(time){
    return (new Date().getFullYear()) - ((time[0]*1000)+(time[1]*100)+(time[2]*10)+(time[3]*1));
}

WEB.prototype.featureLayout = function(head, value, unit){
    try{
        let heading = '';
        let input = '';
        for(let i=0; i<head.length; i++){
            if(i==0){
                heading += '<p>';
                input += '<p>';
            }
            heading += `<span>${head[i]}: </span><br>`;
            input += `${value[i]} ${unit[i]==null?'':unit[i]}<br>`;
            if(i==head.length-1){
                heading += '</p>';
                input += '</p>';
            }
        }
        let layout = heading + input;
        return layout;
    }catch(e){
        return null;
    }
}

WEB.prototype.targetLayout = function(head,statment){
    let layout='';
    for(let i=0; i<head.length; i++){
        if(i==0){
            layout += '<p class="wd-lg">';
        }
        layout += `<span>${head[i]}: </span> ${statment[i]}<br>`;
        if(i==head.length-1){
            layout += '</p>';
        }
    }
    return layout;
}

WEB.prototype.getRelatedDiagnosis = function(relationName){
    const data = jsonfile.readFileSync('./public/manifest.json');
    const relatedDiagnoses = [];
    data['Related-diagnosis'].forEach(diagnosis => {
        if(diagnosis.related.includes(relationName)){
            relatedDiagnoses.push(diagnosis);
        }
    });
    let layout='';
    for(let i=0; i<relatedDiagnoses.length; i++){
        layout += `<li onclick="route('${relatedDiagnoses[i].link}');" title="${relatedDiagnoses[i].name}">${relatedDiagnoses[i].name}</li>`;
    }
    return layout;
}

WEB.prototype.ProductListMaker = async function(){
    const data = jsonfile.readFileSync('./public/manifest.json');
    const productLib = [];
    data['Related-diagnosis'].forEach(diagnosis => {
        productLib.push(diagnosis);
    });
    let productList='';
    let new_productLib = web.productSwapper(productLib);
    for(let i=0; i<new_productLib.length; i++){
        productList += await web.productCardMaker(i,new_productLib);
    }
    return productList;
}

WEB.prototype.productSwapper = function(productLib){
    for(let i=0; i<productLib.length; i++){
        let id = Math.floor(Math.random()*productLib.length);
        let a = productLib[i];
        productLib[i] = productLib[id];
        productLib[id] = a;
    }
    return productLib;
}

WEB.prototype.productCardMaker = async function(id,productLib){
    if(id<=productLib.length && id>=0){
        let card = productLib[id].valueOf();
        let name = card.name, desc = card.desc, link = card.link, img = card.img=='#'?'../images/shape2.gif':card.img;
        const layout = await ejs.renderFile('./views/card.ejs',{name, desc, img, link});
        return (layout.toString());
    }else{
        return null;
    }
}

WEB.prototype.encodedURI = function(url, key){
    let str = url.toString().toLowerCase();
    for(let i=0; i<web.hash.length; i++){
        str = str.replaceAll(web.hash[i][0], web.hash[i][1]);
    }
    return str.toString();
}
WEB.prototype.decodedURI = function(url, key){
    let str = url.toString().toLowerCase();
    for(let i=0; i<web.antihash.length; i++){
        str = str.replaceAll(web.antihash[i][1], web.antihash[i][0]);
    }
    return str.toString();
}

function callPythonProcess(list, functionValue){
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./model/main.py', list, functionValue]);
        let resultData = '';
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        pythonProcess.on('close', (code) => {
            if(code !== 0){
                console.log(`Python script exited with code ${code}`);
            }
            let result = null;
            try{
                if(typeof resultData === 'string'){
                    result = JSON.parse(resultData);
                }else{
                    result = resultData;
                }
                resolve(result);
            }catch(error){
                console.error(`Error parsing JSON: ${error.message}`);
                reject(new Error("Error parsing JSON from Python script"));
            }
        });
    });
}

app.get('*', (req, res) => {
    res.status(404).render('notfound',{error: 404, message: "Page not found on this url, check the source or report it"});
});

server.listen(PORT, (err) => {
    if(err) console.log("Oops an error occure:  "+err);
    console.log(`Compiled successfully!\n\nYou can now view \x1b[33m./${path.basename(__filename)}\x1b[0m in the browser.`);
    console.info(`\thttp://localhost:${PORT}`);
    console.log("\n\x1b[32mNode web compiled!\x1b[0m \n");
});
