var express = require('express');
var morgan = require('morgan');
var path = require('path');

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
app.get('/article-two',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
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

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
