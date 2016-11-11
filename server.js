var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
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
    var hashed=crypto.pbkdf2(inputstring,salt, 100000, 512, 'sha512');
    return hashed.toString('hex');
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
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/article-one',function(req,res){
    res.send(hello(ob));
});
app.get('/ui/main.js',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/articles/:articleName',function(req,res){
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
}); 

//twice attempt
app.get('/blog1',function(req,res){
   pool.query("SELECT * from article ORDER by id ASC",function(err,result){
   if(err){
       res.status(500).send(err.toString());
   } 
   else{
       if(result.rows.length===0){
         res.status(400).send('No blog found');  
       }else{
        res.send(makepage(result.rows));
       }
   } 
   });
}); 
//end here
//function makepage
function makepage(ob1)
 {
     var htmltemplate="";
    for(var m=0;m<ob1.length;m++){
	var title=ob1[m].title;
	var img=ob1[m].image;
	
 htmltemplate += '<html><head><link href="/ui/blog1.css" rel="stylesheet" /><title>Blogs</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
	htmltemplate +='<div style="display: inline-block;">';
if(m===0){	
	htmltemplate +='<div class="half half1" style="background:url('+img+');background-size: cover;"><div class="gradient"></div><span class="cover-title"><a class="nw" href="blog/'+title+'">'+title+'</a></span></div>';
	}
	if(m==1){ 
	htmltemplate +='<div class="half half2" style="background:url('+img+');background-size: cover;"><span class="cover-title2"><a class="nw" href="blog/'+title+'">'+title+'</a></span></div>';
	}
	if(m==2){ 
	htmltemplate +='<div class="half half3" style="background:url('+img+');background-size: cover;"><span class="cover-title2"><a class="nw" href="blog/'+title+'">'+title+'</a></span></div>';
	}
	if(m==3){	
	htmltemplate +='<div class="half half4" style="background:url('+img+');background-size: cover;"><span class="cover-title2"><a class="nw" href="blog/'+title+'">'+title+'</a></span></div>';
	}
	if(m==4){htmltemplate +='</div><div class="below" style="margin-top:350px;"><span class="news">Latest news</span><ul>';}
	if(m>=4 &&m <=7){
	htmltemplate +='<li class="two"><div class="story" style="width:270px;height:221px;"><a href="#"><img src='+img+' width="270px" height="135px"></a>';
	htmltemplate +='<h4 style="color:white;font-family: ARS Maquette,Helvetica Neue,Arial,sans-serif;">'+title+'</h4><span class="cre">Bryan clarks-13hrs ago</span></div></li>';}
	if(m==8){
	htmltemplate +='</ul></div><div class="river-flow"><ul class="river">';}
	if(m>7){
	htmltemplate +='<li class="lis"><div class="tags"><a href="#" class="tag">Apps</a></div><div class="block-content" style="margin-top:25px;position:absolute;">';
	htmltemplate +='<h2 style="color:#F42">'+title+'</h2><span class="image"><a href="#"><img src='+img+' width="200px" height="150px" style="margin-left:820px;position:absolute;"></a></span>Read more</div></li>';
	htmltemplate +='</div></body></html>'; }
   }
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
         res.send(makecontent(articleData));
       }
   } 
   });
}); 

//end here
//function makecontent
function makecontent(ob1){
    var title=ob1.title;
    var image=ob1.image;
    var content=ob1.content;
    var date=ob1.date;
    var template='<html><head><title>'+title+'</title></head><body><div>Date:'+date.toString()+'</div><div><img src='+image+'>';
    template +='</div><div>'+title+'</div><div>'+content+'</div></body></html>';
    return template;
}
//end here
app.get('/article-two',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
app.get('/ui/blog1.css',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'blog1.css'));
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
