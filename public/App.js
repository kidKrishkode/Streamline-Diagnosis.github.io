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