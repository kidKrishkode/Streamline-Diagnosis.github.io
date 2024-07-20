let nav = 0;
let system;
let loader;
function System(){
    try{
        this.listen = window.location;
        this.navigation = window.navigation;
        this.id = window.navigation.currentEntry.id;
        this.key = window.navigation.currentEntry.key;
    }catch(e){
        alert("System not deployed!\n\n",e);
    }
}
function Loader(load){
    this.loaded = load;
}
document.addEventListener("DOMContentLoaded",() =>{
    loader = new Loader(true);
    loader.creat();
    loader.remove(2000);
    system = new System();
    document.getElementById('side-menu').innerHTML = '<div class="hambarger-menu"><ul class="nav justify-content-end">'+document.getElementById('nav-menu').innerHTML+'</ul></div>';
});
function user(){
    try{
        system = new System();
        system.getSideImg();
    }catch(e){
        console.log("menu not found");
    }
}
function navbar_toggle(){
    if(nav==0){
        document.getElementById('side-menu').style.display = "block";
        nav++;
    }else{
        document.getElementById('side-menu').style.display = "none";
        nav--;
    }
}
Loader.prototype.creat = function(){
    if(loader.loaded!=false){
        const loaderEle = document.createElement('div');
        loaderEle.classList.add("loader");
        loaderEle.innerHTML = `<div class="centerDia"><div class="loading"></div></div>`;
        document.body.appendChild(loaderEle);
    }
}
Loader.prototype.remove = function(time){
    if(time<100){
        return false;
    }
    setTimeout(()=>{
        document.body.removeChild(document.querySelector('.loader'));
        loader.loaded = false;
    },time);
}
System.prototype.getSideImg = function(){
    setTimeout(() => {
        try{
            document.querySelector('.images').innerHTML = `<img src="../images/side-img1.jpg" class="imgslid" id="side-img" alt="load"/>`;
        }catch(e){
            console.log('side-image not found!');
        }
    },60000);
}
function route(link){
    window.location = link;
}
function invaild(){
    alert("Sorry, this feature not avalible in this version,\nTry another one!...");
}
System.prototype.validUserName = function(name){
    const namePattern = /^[a-zA-Z]+(?: [a-zA-Z]+)*(?: [a-zA-Z]+)?$/;
    if(namePattern.test(name)){
        if(name.length >= 3 && name.length <= 25){
            return true;
        }
    }
    return false;
}
System.prototype.validLimit = function(limit, value){
    if(value >= limit[0] && value <= limit[1]){
        return true;
    }
    return false;
}
System.prototype.validOptions = function(options, choosen){
    for(let i=0; i<options.length; i++){
        if(options[i] == choosen){
            return true;
        }
    }
    return false;
}
System.prototype.dobToage = function(dob){
    return (new Date().getFullYear()) - ((dob[0]*1000)+(dob[1]*100)+(dob[2]*10)+(dob[3]*1));
}
System.prototype.ProductListMaker = function(){
    let id = document.getElementById('productList');
    id.innerHTML = '';
    system.productSwapper();
    for(let i=0; i<productLib.length; i++){
        id.innerHTML += productCardMaker(i);
    }
}
System.prototype.productSwapper = function(){
    for(let i=0; i<productLib.length; i++){
        let id = Math.floor(Math.random()*productLib.length);
        let a = productLib[i];
        productLib[i] = productLib[id];
        productLib[id] = a;
    }
}
function productCardMaker(id){
    if(id<=productLib.length&&id>=0){
        let card = productLib[id].valueOf();
        temp = [card.id, card.name, card.description];
        if(card.reference!=undefined && card.reference>0){
            for(let i=0; i<productLib.length; i++){
                if(card.reference==productLib[i].id){
                    card = productLib[i].valueOf();
                    break;
                }
            }
        }
        let tuple = `
        <li class="drop" onclick="pageRout(7);currentProductIdentity('${temp[0]}');">
            <div class="product">
                <div class="product-component-top" style="background: url('${ramdomThumnail()}');background-repeat: no-repeat;background-size: cover;">
                    <div class="product-price">${card.cost==0?'Free':'Premium'}</div>
                </div>
                <div class="product-component-middle">
                    <div class="product-headline">
                        <div class="product-dp"style="background: ${randomDpColor()};">${temp[1][0]}</div>
                        <div class="product-head">${temp[1]}</div>
                    </div>
                    <div class="product-description">${temp[2]==''?card.description:temp[2]}</div>
                    <div class="product-owner">@${card.owner} - ${card.owner=='kidKrishkode'?'Owner':'Volunteer'}</div>
                </div>
                <div class="product-tags"></div>
                <div class="product-component-bottom">
                    <div class="product-info" title="Rating"><i class="fa fa-line-chart"></i>${(card.rating).toFixed(1)}/10</div>
                    <div class="product-info" title="Modification"><i class="fa fa-calendar"></i>${card.modified}</div>
                    <div class="product-info" title="Responce time"><i class="fa fa-history"></i>391ms</div>
                </div>
            </div>
        </li>`;
        return tuple;
    }else{
        return null;
    }
}
function search_product(data,list){
    let find=miss=0;
    let input = document.getElementById(`${data}`).value;
    input=input.toLowerCase();
    let x = document.getElementsByClassName(`${list}`);
    for(i = 0; i<x.length; i++){ 
        if(!x[i].innerHTML.toLowerCase().includes(input)){
            x[i].style.display="none";
            miss++;
        }else{
            x[i].style.display="list-item";
            find++;
        }
    }
    if(data=='searchSelectList'){
        data='searchData';
    }
    if(miss>find&&find==0&&miss!=0){
        document.getElementById(data+'DOD').style.display="block";
    }else{
        document.getElementById(data+'DOD').style.display="none";
    }
}
System.prototype.downloadCode = function(id,name){
    const textToDownload = document.getElementById(id).textContent;
    // const fileName = "downloaded_file.txt";
    const fileName = `${name}`;
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}