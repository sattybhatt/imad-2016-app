var cnter=document.getElementById('click');
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
};
var marginLefter=0;
function hello1(){  
    console.log('hello');
    marginLefter =marginLefter+10;
    z[0].style.marginLeft=marginLefter+'px';
    setInterval(hello1,200);
}
/*cnter.onclick=function(){
    console.log(counter);
    counter=counter+1;
   var cnt2=document.getElementsByClassName('cnt');
   cnt2[0].innerHTML=counter.toString();
}; */