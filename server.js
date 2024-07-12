const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
require('dotenv').config();

const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5500;
const AppName = "Streamline Diagnosis";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).render('index');
});

app.get('/diagnosis', (req, res) => {
    res.status(200).render('diagnosis');
});

app.get('/diabetes', (req, res) => {
    res.status(200).render('diabetes');
});

app.get('/diabetes/predict', async (req, res) => {
    try{
        const name = req.query.name;
        const age = getAge(req.query.age);
        const bp = req.query.bp * 1;
        const glu = req.query.glu * 1;
        const fru = req.query.fru * 1;
        const blv = req.query.blv * 1;
        const slh = req.query.slh * 1;
        const wl = req.query.wl * 1;
        const listOfInput = [age, bp, glu, fru, blv, slh, wl];
        if(listOfInput.length > 0){
            await callPythonProcess(listOfInput, 'diabetes').then(result => {
                res.status(200).render('diabetes',{name, result});
            }).catch(error => {
                console.error('Error:', error.message);
            });
        }
    }catch(e){
        console.log(">> Something wrong to process recent request!\n");
    }
});

function getAge(time){
    return (new Date().getFullYear()) - ((time[0]*1000)+(time[1]*100)+(time[2]*10)+(time[3]*1));
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
    console.log(`Compiled successfully!\n\nYou can now view ./${path.basename(__filename)} in the browser.`);
    console.info(`\thttp://localhost:${PORT}`);
    console.log("\nNode web compiled!\n");
});
