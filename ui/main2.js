app.use(express.cookieParser());
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
//temp code
           var commer ='<div style="padding: 15px;position: relative;min-height: 50px;background: rgba(204, 204, 204, 0.07);border-radius: 5px;border: 1px solid #f5f5f5;box-shadow: 1px 1px 6px -3px #7d7d7d;margin-bottom: 20px;"><div style="position: absolute; height: 50px; width: 50px; border-radius: 50%; top:15px; left:15px; overflow: hidden;"><img src="http://i2.wp.com/www.wallpapersbyte.com/wp-content/uploads/2015/06/Space-Galaxy-Circular-Nebula-Vortex-Stars-In-Dark-Blue-Color-WallpapersByte-com-1366x768.jpg?resize=1024%2C576" style="width: 100%; height: 100%;"></div><div style="width:calc(100% - 50px); margin-left: 65px;"><div style="font-weight: bold; ">'+req.session.auth.username2+'</div><div style="margin-top: 7px;">'+comment+'</div></div></div>';
            var z2=document.getElementById('lcm');
            z2.innerHTML = z2.innerHTML +commer;
var aid=document.getElementById('aid').value;
//console.log(comment);
     request.open('POST','http://sattybhatt.imad.hasura-app.io/comment',true);
     request.setRequestHeader('Content-type','application/json');
    request.send(JSON.stringify({comment1:comment,aid2:aid}));
};
//end here

