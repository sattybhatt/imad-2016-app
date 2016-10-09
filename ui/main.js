var cnter=document.getElementById('click');
var counter=0;
cnter.onclick=function(){
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    console.log(request.readyState());
    if(request.readyState==XMLHttpRequest.DONE)
    {
         if(request.status==200)
         {
             console.log(request.responseText());
          var counter=request.responseText();
          var cnt2=document.getElementsByClassName('cnt');
         cnt2[0].innerHTML=counter.toString();
         }
    }
    request.open('GET','http://sattybhatt.imad.hasura-app.io/counter',true);
    request.send(null);
};
}
/*cnter.onclick=function(){
    console.log(counter);
    counter=counter+1;
   var cnt2=document.getElementsByClassName('cnt');
   cnt2[0].innerHTML=counter.toString();
}; */