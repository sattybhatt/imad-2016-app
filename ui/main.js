var cnter=document.getElementById('click');
var counter=0;
cnter.onclick=function(){
    console.log(counter);
    counter=counter+1;
   var cnt2=document.getElementsByClassName('cnt');
   cnt2[0].innerHTML=counter.toString();
};