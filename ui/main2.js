//
var xr=document.getElementById('lcarea');
xr.onclick=function(){
var zr=document.getElementById('writeres');
zr.style.display='block';
};
//
//comment
var submit_btn3=document.getElementById('submitc');
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
    request.send(JSON.stringify({comment1:comment}));
};
//end here

