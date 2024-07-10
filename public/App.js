// document.getElementById('convert').addEventListener('click', () => {
    //     fetch('/diabetes-report').then(response => response.json()).then(data => {
    //         document.getElementById('diabetesData').textContent = JSON.stringify(data, null, 2);
    //     }).catch(error =>{
    //         console.error('Error: ',error);
    //     });
    // });
let nav = 0;
function user(){
    try{
        document.getElementById('side-menu').innerHTML = '<div class="hambarger-menu"><ul class="nav justify-content-end">'+document.getElementById('nav-menu').innerHTML+'</ul></div>';
        getSideImg();
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
function getSideImg(){
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
function validUserName(name){
    const regex = /^[A-Z][a-zA-Z]{2,24}(?:([][A-Z][a-zA-Z]{2,24}))*$/;
    if(regex.test(name)){
        return true;
    }
    return false;
}