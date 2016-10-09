var cnt=document.getElementById('click');
var counter=0;
cnt.onclick=function(){
    counter=counter+1;
   var cnt2=document.getElementById('cnt');
   cnt2.innerHTML(counter);
};