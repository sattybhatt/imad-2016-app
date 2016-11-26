var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var app = express();
var bodyParser=require('body-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'randomvalue',
    cookie:{maxAge:1000*60*60*24*30}
}));
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
            
         }
         else if(request.status==403)
         {
         }
         else if(request.status==500)
         {
         }
    }
};
var comment=document.getElementById('comment').innerHTML;
var aid=document.getElementById('aid').value;
//console.log(comment);
     request.open('POST','http://sattybhatt.imad.hasura-app.io/comment',true);
     request.setRequestHeader('Content-type','application/json');
    request.send(JSON.stringify({comment1:comment,aid2:aid}));
};
//end here

