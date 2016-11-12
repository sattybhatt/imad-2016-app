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
var username=document.getElementById('usrnm');
var password=document.getElementById('password');
console.log(username);
console.log(password);
     request.open('POST','http://sattybhatt.imad.hasura-app.io/create-user',true);
     request.setRequestHeader('Content-type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
};