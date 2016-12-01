var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var session=require('express-session');
var app = express();
var bodyParser=require('body-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'randomvalue',
    cookie:{maxAge:1000*60*60*24*30}
}));
/*app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index2.html'));
}); */
var counter=0;
app.get('/counter',function(req,res){
    counter=counter+1;
    res.send(counter.toString());
});
//hashing unit
app.get('/hash/:input',function(req,res){
    var tc=req.params.input;
    var tc2=hash(tc,'random-string');
    res.send(tc2);
});
function hash(inputstring,salt)
{
    var hashed=crypto.pbkdf2Sync(inputstring,salt, 100000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
//end here
//db connection
var Pool = require('pg').Pool;
var config = {
    user: 'sattybhatt',
    database:'sattybhatt',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query("SELECT * from test",function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
         res.send(JSON.stringify(result.rows));  
       }
    });
});
//create user
app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query("INSERT into user3(username,password) VALUES($1,$2)",[username,dbString],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
        // alert("Username created:"+username);
       }
    });
});
//end here
var sess;
//login user
app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    pool.query("SELECT * from user3 WHERE username=$1",[username],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else if(result.rows.length===0){
             res.send('USERNAME OR PASSWORD IS INVALID');
         }
         else{
             var dbstring=result.rows[0].password;
             var salt=dbstring.split('$')[2];
             var hashedpassword=hash(password,salt);
             if(hashedpassword===dbstring){
                 req.session.auth={userid:result.rows[0].id,username2:username};
                /* sess = req.session;
                 sess.userid=userid;
                 sess.username2=username; */
                 res.send("USER IS CORRECT");
             }
             }
         });
    });
//end
function rid(){
    var rid1=req.session.auth.userid;
    return(rid1);
}
//check login
app.get('/check-login',function(req,res)
{
    //console.log(req.session.auth.userid);
    if(req.session && req.session.auth && req.session.auth.userid)
    {
        res.send('You are logged in:'+req.session.auth.username2.toString());
    }
    else{
     res.send('Not logged in');   
    }
});
//end here
//logout
app.get('/logout',function(req,res)
{
    delete req.session.auth.userid;
    res.send('Logged out');
});
//end here
function hello(ob1)
 {
    
     var title=ob1.title;
var htmltemplate= `<html>
                <head>
                 <title>${title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="style.css">
                </head>
                <body>
               <div><a href="/">Home</a></div>
                  <hr>
                <div class="container">
                <h3>Artivle-one</h3>
                <div>`+ob1.heading+`</div>
                <div>`+ob1.content+`</div>
                </div>
                </body>
                </html>`; 
                return htmltemplate;
}
//comment add
app.post('/comment',function(req,res){
    var comment=req.body.comment1;
    var aid=req.body.aid2;
   // console.log(aid);
    //console.log(comment);
    //console.log(req.session.auth.userid);
    var idc=req.session.auth.userid;
    //console.log(id);
    pool.query("INSERT into comment(idn,comment,aid) VALUES($1,$2,$3)",[idc,comment,aid],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
           res.send('USERNAME OR PASSWORD IS INVALID')
           //alert('Commented');
         //alert("Username created:"+username);
       }
    });
});
//end here
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/article-one',function(req,res){
    res.send(hello(ob));
});
app.get('/ui/main.js',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
/*app.get('/articles/:articleName',function(req,res){
   var articleName = req.params.articleName;
   pool.query("SELECT * from article WHERE title = '"+req.params.articleName+"'",function(err,result){
      // console.log(res);
   if(err){
       res.status(500).send(err.toString());
   } 
   else{
       if(result.rows.length===0){
         res.status(400).send('Article not found');  
       }else{
        var articleData=result.rows[0];
         res.send(hello(articleData));
       }
   } 
   });
}); */

//twice attempt
app.get('/',function(req,res){
   pool.query("SELECT * from article ORDER by id ASC",function(err,result){
   if(err){
       res.status(500).send(err.toString());
   } 
   else{
       if(result.rows.length===0){
         res.status(400).send('No blog found');  
       }
       else{
        res.send(makepage(result.rows,req));
       }
   } 
   });
}); 
//end here
//function makepage
function makepage(ob1,req){
    //start new
	var htmltemplate ='<html><head><link rel="icon" type="image/png" href="/ui/favicon-32x32.png" sizes="32x32" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="/ui/blog2.css" rel="stylesheet" /><title>Sattyam Bhatt\'s Blog</title><link href="https://fonts.googleapis.com/css?family=Gloria+Hallelujah" rel="stylesheet"></head><body><header><div style="display:inline-block;"><img class="lgo" src="http://www.clker.com/cliparts/4/r/X/K/j/e/quill-feather-pen-md.png" style=""><span style="">Sattyam Bhatt\'s Blog</span></div>';
	htmltemplate+='<div id="gm" class="gm" style="display: none;margin-left: 10%;font-size: 26px;color: white;font-weight: bold;font-style: oblique;font-family: Roboto, sans-serif;"></div>'
		 if(req.session && req.session.auth && req.session.auth.userid){
		htmltemplate+='<div id="gm" class="gm" style="display: inline;margin-left: 10%;font-size: 26px;color: white;font-weight: bold;font-style: oblique;font-family: Roboto, sans-serif;">Good day '+req.session.auth.username2+'</div><svg style="height:50px;width:50px;margin-left: 20%;" id="logout" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 46.032 46.033" style="enable-background:new 0 0 46.032 46.033;" xml:space="preserve"><path d="M39.988,14.986h-0.913v-2.372c1.518-0.734,2.565-2.29,2.565-4.089c0-2.508-2.035-4.541-4.543-4.541   s-4.541,2.033-4.541,4.541c0,1.787,1.033,3.332,2.534,4.073v2.388H11.065v-2.385c1.504-0.74,2.539-2.287,2.539-4.076   c0-2.508-2.033-4.541-4.541-4.541S4.522,6.017,4.522,8.525c0,1.797,1.044,3.351,2.56,4.086v2.375H6.034   C2.687,14.986,0,17.718,0,21.064V35.99c0,3.346,2.687,6.059,6.034,6.059H39.99c3.346,0,6.042-2.713,6.042-6.059V21.064   C46.031,17.718,43.335,14.986,39.988,14.986z M16.061,32.626h-6.007v-9.421h5.817v1.707h-3.667v2.022h3.477v1.707h-3.477v2.277   h3.857V32.626z M22.524,32.626l-0.856-1.715c-0.351-0.658-0.575-1.131-0.842-1.699h-0.027c-0.197,0.568-0.435,1.041-0.73,1.699   l-0.785,1.715h-2.441l2.736-4.767l-2.638-4.655h2.455l0.828,1.721c0.281,0.576,0.491,0.998,0.716,1.567h0.028   c0.225-0.632,0.407-1.021,0.646-1.567l0.8-1.721h2.441l-2.667,4.598l2.806,4.824H22.524L22.524,32.626z M28.264,32.626h-2.15   v-9.421h2.15V32.626z M36.673,24.976h-2.592v7.65h-2.149v-7.65h-2.529v-1.771h7.271V24.976z" fill="#D80027"/></svg><div style="display:none" class="lgin" id="lgin"><input type="text" name="rusername" id="rusername" placeholder="Username"><input type="password" name="rpassword" id="rpassword" placeholder="Password here"><button class="submit" value="login" id="rsubmitbutton"   name="submit" value="submit">Sign in</button></div></header>';
	htmltemplate+='<div class="signin"></div>';
	} 
	else{
	    htmltemplate+='<div style="" class="lgin" id="lgin"><input type="text" name="rusername" id="rusername" placeholder="Username"><input type="password" name="rpassword" id="rpassword" placeholder="Password here"><button class="submit" value="login" id="rsubmitbutton"   name="submit" value="submit">Sign in</button></div></header>';
	htmltemplate+='<div class="signin"></div>';
	}
	htmltemplate+='<div id="lk" style="display:none;padding: 15px;position: relative;height: 100px;background: rgba(204, 204, 204, 0.07);border-radius: 5px;border: 1px solid #f5f5f5;"><div id="addo" style="width: 240px;margin-left: 40%;margin-top: 200px;padding: 15px;position: absolute;height: 100px;background: white;border-radius: 5px;border: 1px solid #f5f5f5;box-shadow: 1px 1px 6px -3px #7d7d7d;margin-bottom: 20px;z-index: 900;"><div style="position: absolute; height: 50px; width: 50px; border-radius: 50%; top:15px; left:15px; overflow: hidden;"><img src="http://i2.wp.com/www.wallpapersbyte.com/wp-content/uploads/2015/06/Space-Galaxy-Circular-Nebula-Vortex-Stars-In-Dark-Blue-Color-WallpapersByte-com-1366x768.jpg?resize=1024%2C576" style="width: 100%; height: 100%;"></div><div style="width:calc(100% - 50px); margin-left: 65px;"><div style="font-weight: bold; ">Registered</div><div style="margin-top: 7px;">Click here to login</div></div></div></div>';
	htmltemplate+='<div id="lgif" style="display:none;"><svg width=118px height=118px xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><defs><filter id="uil-ring-shadow" x="-100%" y="-100%" width="300%" height="300%"><feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset><feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur><feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend></filter></defs><path d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z" fill="#31a115" filter="url(#uil-ring-shadow)"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite" dur="1s"></animateTransform></path></svg></div>'
htmltemplate+='<div class="mm" id="mm"><div class="mid"><div class="container"><div class="head"></div><div class="arcts">';
	//check end
	for(var m=0;m<ob1.length;m++){
	var title=ob1[m].title;
	var img=ob1[m].image;
	var tags2=ob1[m].tags.split(',');
	htmltemplate+='<a class="nw" href="blog/'+title+'"><div class="article"><div class="artimg" style="background-image: url('+img+')"><div style="background:linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%,  rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.7) 100%); position: absolute; height: 100%; width:100%; top:0; right:0;"><div style="position: absolute; bottom: 0; left: 0px; width: 100%; padding:10px 20px; box-sizing: border-box;">';
	for(var m2=0;m2<tags2.length;m2++){							
	htmltemplate+='<div style="margin-right:3px;display: inline-block;color:white;text-align: center;padding: 5px 10px;border-radius: 4px;background: #3f3f3f;font-size: 17px;border: 1px solid rgba(150,150,150,0.3137254901960784);">#'+tags2[m2]+'</div>'
	}
	htmltemplate+='</div></div></div><div class="arttit"><div class="artit">'+title+'</div><div class="artres"><div class="vm" style="padding-right: 15px;border-right: 1px solid #ccc;">';
	htmltemplate+='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58"><path d="M29 1.5c16 0 29 11.6 29 26 0 5.3-1.8 10.2-4.8 14.3C53.6 46.6 54.7 53.2 58 56.5c0 0-9.9-1.4-16.7-5.5 0 0 0 0 0 0 -2.8-1.8-5.5-3.7-6.1-4.1 -0.3-0.4-0.9-0.5-1.3-0.3 -0.3 0.2-0.5 0.5-0.5 0.8 0 0.6 0 0.8 5.6 4.4C35.9 52.9 32.5 53.5 29 53.5c-16 0-29-11.6-29-26C0 13.1 13 1.5 29 1.5z" fill="#4DC95B"/></svg></svg><div style="text-align: center; margin-top: 5px;">24</div></div><div class="vm" style="padding-left: 10px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 504.2 504.2"><path d="M44.2 91.8c74.8-76 148.5-42.5 208 11.4 59.1-54 132.7-87.8 208-11.4 58.7 59.5 59.1 155.2 0 214.6 -98.9 90.6-150.4 137.5-177.6 162.3 -16.9 15.4-42.5 15.4-59.5 0 -27.2-24.4-79.2-71.7-178.8-162.3C-14.9 247.4-14.5 151.7 44.2 91.8z" fill="#E2574C"/><path d="M252.1 103.2v377.3c10.6 0 21.7-3.9 30.3-11.4 27.2-24.8 78.8-71.7 177.6-162.3 59.1-59.5 58.7-155.2 0-214.6C384.8 15.4 311.2 49.3 252.1 103.2z" fill="#D65348"/><path d="M386 82.8c35.4-3.9 55.1-23.6 59.1-59.1 3.9 35.4 23.6 55.1 59.1 59.1 -35.4 3.9-55.1 23.6-59.1 59.1C441.2 106.4 421.5 86.7 386 82.8z" fill="#EFC75E"/><path d="M55.2 194.6c0-50.8 41.4-92.2 92.2-92.2 5.9 0 10.2 4.7 10.2 10.2 0 5.9-4.7 10.2-10.2 10.2 -39.4 0-71.3 31.9-71.3 71.3 0 5.9-4.7 10.2-10.2 10.2C59.9 204.8 55.2 200.1 55.2 194.6z" fill="#E67067"/></svg>';
	htmltemplate+='<div style="text-align: center; margin-top: 5px;">24</div></div></div></div></div></a>';
	}	
	htmltemplate+='</div></div><div class="explore"><div class="head"></div><div class=""><div class="" style="float: left;margin: 0 0 20px 20px; "><div style="font-size: 25px;color: #25a8ed;">Not a Member of this app? <div>Sign Up Now</div></div>';
	htmltemplate+='<input style="padding: 6px;border: 1px solid;border-radius: 4px;margin: 10px;width: 250px;padding: 6px;border: 1px solid;border-radius: 4px;margin: 10px;width: 250px;border-color: #bdc7d8;border-radius: 5px;height: 35px;" type="text" name="usrnm" id="usrnm" placeholder="Username"><input style="padding: 6px;border: 1px solid;border-radius: 4px;margin: 10px;width: 250px;padding: 6px;border: 1px solid;border-radius: 4px;margin: 10px;width: 250px;border-color: #bdc7d8;border-radius: 5px;height: 35px;" type="password" name="password" id="password" placeholder="Password here"><div><button class="submit" value="login" id="submitbutton" name="submit" style="padding: 6px;border: 1px solid;border-radius: 4px;margin: 10px;width: 250px;height: 45px;background:#3f3f3f;"><span style="font-size:18px">Register</span></button></div></div></div>';
	htmltemplate+='<div class=""><div class="" style="margin: 0 0 20px 20px; "><div style="font-size: 28px;color: #25a8ed;margin-bottom: 13px;">About the developer</div><img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAmEAAAAJGM0NTYzYmZhLTFlYzQtNDkzMS1iZmY1LTY2YWZkYzI0N2E4ZA.jpg" style="width: 90px;margin-left: inherit;vertical-align: middle;"><div class="pf" style="color: #25a8ed;margin-top: 29px;padding: 10px;">View full profile</div><div style="font-size: 20px;padding: 10px;margin-left: inherit;font-family: cursive;">Profiles</div><a href="https://www.facebook.com/sattyam.bhatt"><svg class="fb" style="height: 50px;" viewBox="0 0 512 512"><path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"/></svg></a><a href="https://twitter.com/sattyambhatt"><svg class="tw" style="height: 50px;" viewBox="0 0 512 512"><path d="M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z"/></svg></a>';
	htmltemplate+='<a href="http://stackoverflow.com/users/6570542/satty"><svg class="so" style="height: 50px;"  viewBox="0 0 512 512"><path d="M294.8 361.2l-122 0.1 0-26 122-0.1L294.8 361.2zM377.2 213.7L356.4 93.5l-25.7 4.5 20.9 120.2L377.2 213.7zM297.8 301.8l-121.4-11.2 -2.4 25.9 121.4 11.2L297.8 301.8zM305.8 267.8l-117.8-31.7 -6.8 25.2 117.8 31.7L305.8 267.8zM321.2 238l-105-62 -13.2 22.4 105 62L321.2 238zM346.9 219.7l-68.7-100.8 -21.5 14.7 68.7 100.8L346.9 219.7zM315.5 275.5v106.5H155.6V275.5h-20.8v126.9h201.5V275.5H315.5z"/></svg></a><a href="https://in.linkedin.com/in/sattyam-bhatt"><svg class="lin" style="height: 50px;" viewBox="0 0 512 512"><path d="M186.4 142.4c0 19-15.3 34.5-34.2 34.5 -18.9 0-34.2-15.4-34.2-34.5 0-19 15.3-34.5 34.2-34.5C171.1 107.9 186.4 123.4 186.4 142.4zM181.4 201.3h-57.8V388.1h57.8V201.3zM273.8 201.3h-55.4V388.1h55.4c0 0 0-69.3 0-98 0-26.3 12.1-41.9 35.2-41.9 21.3 0 31.5 15 31.5 41.9 0 26.9 0 98 0 98h57.5c0 0 0-68.2 0-118.3 0-50-28.3-74.2-68-74.2 -39.6 0-56.3 30.9-56.3 30.9v-25.2H273.8z"/></svg></a><a href="https://github.com/sattybhatt"><svg class="gi" style="height: 50px;" viewBox="0 0 512 512"><path d="M256 70.7c-102.6 0-185.9 83.2-185.9 185.9 0 82.1 53.3 151.8 127.1 176.4 9.3 1.7 12.3-4 12.3-8.9V389.4c-51.7 11.3-62.5-21.9-62.5-21.9 -8.4-21.5-20.6-27.2-20.6-27.2 -16.9-11.5 1.3-11.3 1.3-11.3 18.7 1.3 28.5 19.2 28.5 19.2 16.6 28.4 43.5 20.2 54.1 15.4 1.7-12 6.5-20.2 11.8-24.9 -41.3-4.7-84.7-20.6-84.7-91.9 0-20.3 7.3-36.9 19.2-49.9 -1.9-4.7-8.3-23.6 1.8-49.2 0 0 15.6-5 51.1 19.1 14.8-4.1 30.7-6.2 46.5-6.3 15.8 0.1 31.7 2.1 46.6 6.3 35.5-24 51.1-19.1 51.1-19.1 10.1 25.6 3.8 44.5 1.8 49.2 11.9 13 19.1 29.6 19.1 49.9 0 71.4-43.5 87.1-84.9 91.7 6.7 5.8 12.8 17.1 12.8 34.4 0 24.9 0 44.9 0 51 0 4.9 3 10.7 12.4 8.9 73.8-24.6 127-94.3 127-176.4C441.9 153.9 358.6 70.7 256 70.7z"/></svg></a>';
	htmltemplate+='</div></div><a class="twitter-timeline" data-width="365" data-height="600" data-theme="dark" href="https://twitter.com/sattyambhatt">Tweets by sattyambhatt</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></div></div></body><script type="text/javascript" src="/ui/main.js"></script></html>'
   return htmltemplate; 
}
//end here
///blog page
app.get('/blog/:blogName',function(req,res){
   var blogName = req.params.blogName;
   pool.query("SELECT * from article WHERE title = '"+req.params.blogName+"'",function(err,result){
      // console.log(res);
   if(err){
       res.status(500).send(err.toString());
   } 
   else{
       if(result.rows.length===0){
         res.status(400).send('Article not found');  
       }else{
        var articleData=result.rows[0];
         res.send(makecontent(articleData,req));
       }
   } 
   });
}); 
 //window.comm="";
 comm="";username="";
function returnc(aid2){
    var aid=aid2;
		pool.query("SELECT * from comment WHERE aid=$1 ORDER by cno DESC",[aid],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else if(result.rows.length===0){
             res.send('No comment');
         }
         else{
              ob2=result.rows;
        for(var n=0;n<ob2.length;n++){
		var idc=ob2[n].idn;
		var comment=ob2[n].comment;
		//console.log(comment);
		pool.query("SELECT username from user3 WHERE id=$1",[idc],function(err,result9){
       if(err){
           res.status(500).send(err.toString());
       } else if(result9.rows.length===0){
             res.send('USERNAME OR PASSWORD IS INVALID');
         }
         else{
             username=result9.rows[n].username.toString();
            // console.log(username);
             }
             })
           //  console.log(' iteartion username'+username);
             comm +='<div style="padding: 15px;position: relative;min-height: 50px;background: rgba(204, 204, 204, 0.07);border-radius: 5px;border: 1px solid #f5f5f5;box-shadow: 1px 1px 6px -3px #7d7d7d;margin-bottom: 20px;"><div style="position: absolute; height: 50px; width: 50px; border-radius: 50%; top:15px; left:15px; overflow: hidden;"><img src="http://i2.wp.com/www.wallpapersbyte.com/wp-content/uploads/2015/06/Space-Galaxy-Circular-Nebula-Vortex-Stars-In-Dark-Blue-Color-WallpapersByte-com-1366x768.jpg?resize=1024%2C576" style="width: 100%; height: 100%;"></div><div style="width:calc(100% - 50px); margin-left: 65px;"><div style="font-weight: bold; ">'+username+'</div><div style="margin-top: 7px;">'+comment+'</div></div></div>';
            
        }
             
             }
             })
            // console.log('comm'+global.comm);
      return comm;       
}

//end here
//function makecontent
function makecontent(ob1,req){
    var title=ob1.title;
    var username2="";
    var image=ob1.image;
    var content=ob1.content;
    var date=ob1.date;
    if(req.session && req.session.auth && req.session.auth.userid){
     username2=req.session.auth.username2;
    }
    else{username2="Guest"; }
	var aid=ob1.id;
	var z=returnc(aid);
	 global.comm="";
	console.log('z'+z);
	var tags2=ob1.tags.split(',');
	var ob2="";
	var template="";
     template+='<!DOCTYPE html><html><head><link rel="icon" type="image/png" href="/ui/favicon-32x32.png" sizes="32x32" /><link href="/ui/blog3.css" rel="stylesheet" /><link href="/ui/blog2.css" rel="stylesheet" /></head><body>';
    template +='<input type="hidden" name="aid" id="aid" value="'+aid+'"><input type="hidden" id="username2" value="'+username2+'"><header><div style="display:inline-block;"><img class="lgo" src="http://www.clker.com/cliparts/4/r/X/K/j/e/quill-feather-pen-md.png" style=""><span style="">Sattyam Bhatt\'s Blog</span></div><div id="gm" class="gm" style="display: none;margin-left: 10%;font-size: 26px;color: white;font-weight: bold;font-style: oblique;font-family: Roboto, sans-serif;"></div>'
     if(req.session && req.session.auth && req.session.auth.userid){
		template+='<div id="gm" class="gm" style="display: inline;margin-left: 10%;font-size: 26px;color: white;font-weight: bold;font-style: oblique;font-family: Roboto, sans-serif;">Good day '+req.session.auth.username2+'</div><svg style="height:50px;width:50px;margin-left: 20%;" id="logout" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 46.032 46.033" style="enable-background:new 0 0 46.032 46.033;" xml:space="preserve"><path d="M39.988,14.986h-0.913v-2.372c1.518-0.734,2.565-2.29,2.565-4.089c0-2.508-2.035-4.541-4.543-4.541   s-4.541,2.033-4.541,4.541c0,1.787,1.033,3.332,2.534,4.073v2.388H11.065v-2.385c1.504-0.74,2.539-2.287,2.539-4.076   c0-2.508-2.033-4.541-4.541-4.541S4.522,6.017,4.522,8.525c0,1.797,1.044,3.351,2.56,4.086v2.375H6.034   C2.687,14.986,0,17.718,0,21.064V35.99c0,3.346,2.687,6.059,6.034,6.059H39.99c3.346,0,6.042-2.713,6.042-6.059V21.064   C46.031,17.718,43.335,14.986,39.988,14.986z M16.061,32.626h-6.007v-9.421h5.817v1.707h-3.667v2.022h3.477v1.707h-3.477v2.277   h3.857V32.626z M22.524,32.626l-0.856-1.715c-0.351-0.658-0.575-1.131-0.842-1.699h-0.027c-0.197,0.568-0.435,1.041-0.73,1.699   l-0.785,1.715h-2.441l2.736-4.767l-2.638-4.655h2.455l0.828,1.721c0.281,0.576,0.491,0.998,0.716,1.567h0.028   c0.225-0.632,0.407-1.021,0.646-1.567l0.8-1.721h2.441l-2.667,4.598l2.806,4.824H22.524L22.524,32.626z M28.264,32.626h-2.15   v-9.421h2.15V32.626z M36.673,24.976h-2.592v7.65h-2.149v-7.65h-2.529v-1.771h7.271V24.976z" fill="#D80027"/></svg><div style="display:none" class="lgin" id="lgin"><input type="text" name="rusername" id="rusername" placeholder="Username"><input type="password" name="rpassword" id="rpassword" placeholder="Password here"><button class="submit" value="login" id="rsubmitbutton"   name="submit" value="submit">Sign in</button></div></header>';
	template+='<div class="signin"></div>';
	} 
	else{
	    template+='<div style="" class="lgin" id="lgin"><input type="text" name="rusername" id="rusername" placeholder="Username"><input type="password" name="rpassword" id="rpassword" placeholder="Password here"><button class="submit" value="login" id="rsubmitbutton"   name="submit" value="submit">Sign in</button></div></header>';
	template+='<div class="signin"></div>';
	}
	template +='<div style="position: relative; top:50px;"><div class="artcon"><div style="height:350px; width: 100%; overflow: hidden; background-position: center; background-size: cover; position: relative;background-image: url('+image+')"><div style="background:linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 80%,  rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.7) 100%); position: relative; height: 100%;"><div style="width: 650px;margin: auto;height: 100%;position: relative;"><div class="incenter" style="text-align: center; color: white; font-family: Open Sans, sans-serif; text-transform:uppercase; font-size: 40px; font-weight: 800;">'+title+'</div><div style="position: absolute; bottom: 0; left: 0px; width: 100%; padding:10px 20px; box-sizing: border-box;">';
	for(var m=0;m<tags2.length;m++)
	{template +='<div style="font-family: open sans;margin-right: 3px;display: inline-block;color: white;text-align: center;padding: 5px 10px;border-radius: 4px;background: #104d90;font-size: 17px;border: 1px solid rgba(150,150,150,0.3137254901960784);">#'+tags2[m]+'</div>';}
	template +='</div></div></div></div><div><div style="margin: auto; width:650px; padding: 20px; box-sizing: border-box;"><div class="reviews" style="height: 50px;"><div class="vm" style="border-right: 1px solid #ccc; padding-right: 15px; "><svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="display: inline-block;fill:red; vertical-align: middle; width: 40px;"><path d="M16 31.3l-.5-.3c-.3-.2-8.3-4.9-12.8-12.1C.3 15.1-.5 11.1.6 7.6c.9-2.9 2.8-5.1 5.6-6.3 1-.4 2-.7 2.9-.7 3.2 0 5.7 2.2 6.9 3.6C17.3 2.8 19.7.6 22.9.6c1 0 2 .2 2.9.7 2.8 1.2 4.7 3.5 5.6 6.3 1 3.5.3 7.5-2.1 11.3-4.5 7.2-12.4 11.9-12.7 12.1l-.6.3zM9.1 2.8c-.7 0-1.4.2-2.1.5-2.2 1-3.7 2.8-4.4 5-.9 2.9-.2 6.3 1.9 9.5 3.6 5.7 9.7 9.8 11.5 11 1.9-1.2 7.9-5.4 11.5-11 2.1-3.3 2.7-6.6 1.9-9.5-.7-2.2-2.2-4-4.4-5-.7-.3-1.4-.5-2.1-.5-3.4 0-6 3.8-6 3.8L16 8l-.9-1.4s-2.6-3.8-6-3.8z"/></svg><div style="display: inline-block; vertical-align: middle; font-size: 22px; margin-left: 10px; ">24</div><svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="display: inline-block; vertical-align: middle; width: 40px;fill:tomato;"><path d="M30.5 31.7c-.1 0-.3 0-.4-.1l-5.8-2c-.3-.1-.7-.1-1 .1-2.8 1.5-6.1 2.2-9.3 1.8C6.8 30.7 1 24.8.3 17.6-.2 12.9 1.4 8.3 4.7 5 8 1.7 12.5 0 17.2.4c7.1.6 13 6.1 14.1 13.1.5 3.1.1 6.3-1.3 9.2-.1.3-.2.6-.1.9l1.9 6.6c.1.5 0 1-.4 1.3-.3.1-.6.2-.9.2zM15.9 2.3c-3.7 0-7.2 1.5-9.8 4.1-2.9 2.9-4.3 6.9-3.8 11 .6 6.3 5.7 11.4 12 12.1 2.8.3 5.6-.2 8.1-1.6.8-.4 1.7-.5 2.6-.2l4.6 1.6-1.6-5.2c-.2-.7-.2-1.6.2-2.3 1.2-2.5 1.6-5.3 1.1-8-.9-6.2-6.1-11-12.3-11.5h-1.1z"/></svg></svg><div style="display: inline-block; vertical-align: middle;">24</div></div></div><div><div style="font-size: 20px; line-height: 1.6em;">'+content+'</div>';
	template +='</div><div class="" style="margin-top: 30px; border-top:1px solid #ccc;"><div class="head" style="margin: 20px 0;font-size: 22px;font-weight: bold;">Responses</div><div class="" style=""><div style="position:relative; margin-bottom:20px;" id="lcarea"><div class="writeresprev" style="padding: 15px;position: relative;height: 50px;background: rgba(204, 204, 204, 0.07);border-radius: 5px;box-shadow: 1px 1px 6px -3px #7d7d7d;margin-bottom: 20px;cursor: pointer;border: 1px solid #f5f5f5;"><div class="incenter"><div style="display: inline-block;vertical-align: middle;width: 25px;margin-right: 15px;"><svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M30.5 31.7c-.1 0-.3 0-.4-.1l-5.8-2c-.3-.1-.7-.1-1 .1-2.8 1.5-6.1 2.2-9.3 1.8C6.8 30.7 1 24.8.3 17.6-.2 12.9 1.4 8.3 4.7 5 8 1.7 12.5 0 17.2.4c7.1.6 13 6.1 14.1 13.1.5 3.1.1 6.3-1.3 9.2-.1.3-.2.6-.1.9l1.9 6.6c.1.5 0 1-.4 1.3-.3.1-.6.2-.9.2zM15.9 2.3c-3.7 0-7.2 1.5-9.8 4.1-2.9 2.9-4.3 6.9-3.8 11 .6 6.3 5.7 11.4 12 12.1 2.8.3 5.6-.2 8.1-1.6.8-.4 1.7-.5 2.6-.2l4.6 1.6-1.6-5.2c-.2-.7-.2-1.6.2-2.3 1.2-2.5 1.6-5.3 1.1-8-.9-6.2-6.1-11-12.3-11.5h-1.1z"/></svg></svg></div><div style="display: inline-block;vertical-align: middle;font-size: 20px;">Write your response.</div></div></div><div class="writeres" id="writeres" style="display: none; padding: 15px; position: relative; background: rgba(204, 204, 204, 0.07);border-radius: 5px;box-shadow: 1px 1px 6px -3px #7d7d7d; margin-bottom: 20px; border: 1px solid #f5f5f5;"><div class="writehere" placeholder="Your comment here" id="comment" contenteditable="true" style="min-height: 50px;background:white;padding: 15px;border: 1px solid #e1e1e1;"></div><div id="submitc" style="display: inline-block; padding: 7px 20px; background: #34a1ef; color: white; font-weight: bold; margin-top: 14px; border-radius: 5px; cursor: pointer;">Post</div></div></div><div id="lcm">';
	template +=z+'</div></div></div></div></div></div><div class="artmore"></div><div class="footer"></div></div><script src="/ui/main2.js"></script></script></body></html>';
	return template; 
}
//end here
app.get('/article-two',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
app.get('/ui/blog1.css',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'blog1.css'));
});
app.get('/ui/favicon-32x32.png',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'favicon-32x32.png'));
});
app.get('/ui/blog2.css',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'blog2.css'));
});
app.get('/ui/blog3.css',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'blog3.css'));
});
app.get('/ui/main2.js',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'main2.js'));
});
app.get('/article-three',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/ui/intro.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'intro.html'));
});
app.get('/blog.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'blog.html'));
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
