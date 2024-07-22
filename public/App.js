let nav = 0;
let system;
let loader;
function System(){
    try{
        this.listen = window.location;
        this.navigation = window.navigation;
        this.id = window.navigation.currentEntry.id;
        this.key = window.navigation.currentEntry.key;
        this.notes = false;
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
    system.appendBot();
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
System.prototype.encodedURI = function(head, url, key){
    let hash = [['0','*z'],['1','*y'],['2','*x'],['3','*w'],['4','*v'],['5','*u'],['6','*t'],['7','*s'],['8','*r'],['9','*q'],['&',0],['+',1],['=',2],['-',3],['a',4],['e',5],['i',6],['n',7],['u',8],['g',9]];
    let str = url.toString().toLowerCase();
    for(let i=0; i<hash.length; i++){
        str = str.replaceAll(hash[i][0], hash[i][1]);
    }
    return head+'?encode='+str.toString();
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
System.prototype.appendBot = function(){
    try{
        let layout = `<div id="botDiv" ondblclick="system.openNotes();"><i class="fa fa-sticky-note-o"></i></div>`;
        document.body.innerHTML += layout;
        system.moveBot();
    }catch(e){
        console.warn('Note button provide not possible');
    }
}
System.prototype.removeBot = function(){
    try{
        document.getElementById('botDiv').style.display = "none";
    }catch(e){
        console.warn('Note button provide not possible');
    }
}
System.prototype.appendBotCls = function(){
    try{
        const layout = document.createElement('div');
        layout.classList.add("botCln");
        layout.innerHTML = '&times;';
        document.body.appendChild(layout);
    }catch(e){
        console.warn('Note cls button provide not possible');
    }
}
System.prototype.removeBotCls = function(){
    try{
        document.body.removeChild(document.querySelector('.botCln'));
    }catch(e){
        console.warn('Note cls button remove not possible');
    }
}
System.prototype.moveBot = function(){
    constbotDiv = document.getElementById('draggableDiv');
    function startDrag(e){
        e.preventDefault();
        botDiv.style.cursor = 'grabbing';
        if(!system.notes){
            system.appendBotCls();
        }
        const isTouch = e.type === 'touchstart';
        const initialX = isTouch ? e.touches[0].clientX : e.clientX;
        const initialY = isTouch ? e.touches[0].clientY : e.clientY;
        const offsetX = initialX -botDiv.getBoundingClientRect().left;
        const offsetY = initialY -botDiv.getBoundingClientRect().top;
        function moveAt(pageX, pageY){
            const newX = pageX - offsetX;
            const newY = pageY - offsetY;
            // Boundary checks
            const minLeft = 0;
            const maxLeft = window.innerWidth -botDiv.offsetWidth;
            const minTop = 0;
            const maxTop = window.innerHeight -botDiv.offsetHeight;
            const leftPos = Math.min(Math.max(newX, minLeft), maxLeft);
            const topPos = Math.min(Math.max(newY, minTop), maxTop);
            botDiv.style.left = leftPos + 'px';
            botDiv.style.top = topPos + 'px';
            if(topPos>=(maxTop-40) && topPos<=maxTop  && leftPos>=(maxLeft/2)-40 && leftPos<=(maxLeft/2)+40){
                system.removeBot();
            }
        }
        function onMouseMove(event){
            const moveX = isTouch ? event.touches[0].clientX : event.clientX;
            const moveY = isTouch ? event.touches[0].clientY : event.clientY;
            moveAt(moveX, moveY);
        }
        function stopDrag(){
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', stopDrag);
            botDiv.style.cursor = 'grab';
            system.removeBotCls();
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onMouseMove);
        document.addEventListener('touchend', stopDrag);
    }
    botDiv.addEventListener('mousedown', startDrag);
    botDiv.addEventListener('touchstart', startDrag);
    botDiv.ondragstart = function(){
        return false;
    };
}
System.prototype.openNotes = function(){
    try{
        document.getElementById('botDiv').style.height = "80%";
        document.getElementById('botDiv').style.width = "30%";
        document.getElementById('botDiv').innerHTML = `<div class="noteTab"><div class="option"><span class="btn" onclick="system.minimizeNote();">&minus;</span>
        <span class="btn" onclick="system.removeBot();">&times;</span></div><iframe src="https://kidkrishkode.github.io/NoteBook.github.io/"></iframe></div>`;
        system.notes = true;
    }catch(e){
        console.warn("Note open not possible!");
    }
}
System.prototype.minimizeNote = function(){
    try{
        document.getElementById('botDiv').style.height = "50px";
        document.getElementById('botDiv').style.width = "50px";
        document.getElementById('botDiv').innerHTML = `<i class="fa fa-sticky-note-o"></i>`;
        system.notes = false;
    }catch(e){
        console.warn("Minimize note tab not possible!");
    }
}