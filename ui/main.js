/*var cnter=document.getElementById('click');
var counter=0;
cnter.onclick=function(){
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    if(request.readyState==XMLHttpRequest.DONE)
    {
         if(request.status==200)
         {
             console.log(request.responseText);
          var counter=request.responseText;
          var cnt2=document.getElementsByClassName('cnt');
         cnt2[0].innerHTML=counter.toString();
         }
    }
};
     request.open('GET','http://sattybhatt.imad.hasura-app.io/counter',true);
    request.send(null);
};
var z=document.getElementsByClassName('img-medium');
z[0].onclick=function(){
    hello1();
    setInterval(hello1,2000);
};
var marginLefter=0;
function hello1(){  
    console.log('hello');
    marginLefter =marginLefter+2;
    z[0].style.marginLeft=marginLefter+'px';
} */
//code for registering user submit_btn
var submit_btn=document.getElementById('submitbutton');
submit_btn.onclick=function(){
    var lo=document.getElementById('lk');
    lo.style.display='block';
    var lc=document.getElementById('mm');
    lo.style.opacity='0.2';
    console.log('hello submit button is clicked');
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    if(request.readyState==XMLHttpRequest.DONE)
    {
         if(request.status==200)
         {
             console.log(request.responseText);
            alert('USer created');
         }
         else if(request.status==403)
         {
            alert('USername/password is incorrect');
         }
         else if(request.status==500)
         {
            alert('Something went wrong on server');
         }
    }
};
var username2=document.getElementById('usrnm').value;
var password2=document.getElementById('password').value;
console.log(username2);
console.log(password2);
     request.open('POST','http://sattybhatt.imad.hasura-app.io/create-user',true);
     request.setRequestHeader('Content-type','application/json');
     request.send(JSON.stringify({username: username2,password: password2}));
};
//end here
//code for login
var submit_btn2=document.getElementById('rsubmitbutton');
submit_btn2.onclick=function(){
    console.log('hello submit button is clicked');
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    if(request.readyState==XMLHttpRequest.DONE)
    {
         if(request.status==200)
         {     
             var m="";
             console.log(request.responseText);
             var x=new Date().getHours();
             if((x>6)&&(x<12)){ m="Good mroning "+username;}
             else if((x>12)&&(x<22)){ m="Good evening "+username;}
             else{ m="Its night"+username;}
             var n2=document.getElementById('gm');
             var n3=document.getElementById('lgin');
             n3.style.display='none';
             n2.innerHTML=m;
             n2.style.display='inline-block';
            //alert(m);
         }
         else if(request.status==403)
         {
            alert('USername/password is incorrect');
         }
         else if(request.status==500)
         {
            alert('Something went wrong on server');
         }
    }
};
var username=document.getElementById('rusername').value;
var password=document.getElementById('rpassword').value;
console.log(username);
console.log(password);
     request.open('POST','http://sattybhatt.imad.hasura-app.io/login',true);
     request.setRequestHeader('Content-type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
};
//end here
//comment
/*var submit_btn3=document.getElementById('submitc');
submit_btn3.onclick=function(){
    console.log('hello submit button is clicked');
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    if(request.readyState==XMLHttpRequest.DONE)
    {
         if(request.status==200)
         {
             console.log(request.responseText);
            alert('Commented');
         }
         else if(request.status==403)
         {
            alert('USername/password is incorrect');
         }
         else if(request.status==500)
         {
            alert('Something went wrong on server');
         }
    }
};
var comment=document.getElementById('comment').value;
//console.log(comment);
     request.open('POST','http://sattybhatt.imad.hasura-app.io/comment',true);
     request.setRequestHeader('Content-type','application/json');
    request.send(JSON.stringify({comment:comment}));
}; */
