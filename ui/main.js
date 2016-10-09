var cnter=document.getElementById('click');
var counter=0;
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
  
    if(request.readyState==XMLHttpRequest.DONE)
    {
         if(request.status==200)
         {
          var counter=request.responsetext();
          var cnt2=document.getElementsByClassName('cnt');
         cnt2[0].innerHTML=counter.toString();
         }
    }
    request.open('GET','http://sattybhatt.imad.hasura-app.io/counter',true);
};
/*cnter.onclick=function(){
    console.log(counter);
    counter=counter+1;
   var cnt2=document.getElementsByClassName('cnt');
   cnt2[0].innerHTML=counter.toString();
}; */