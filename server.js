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
/*var ob={
    title:"Article-one",
    heading:"Article-one",
    date:"5 sept 2016",
    content:`       <div class="container">
                    <h3>Artivle-one</h3>
                    <div>5 sept 2016</div>
                    <div>
                      <p>Let's see how this life rolls</p>
                         <p>Let's see how this life rolls</p>
                         <p>Let's see how this life rolls</p>
                         <p>Let's see how this life rolls</p>
                             <p>Let's see how this life rolls</p>
                            <p>Let's see how this life rolls</p>
                            <p>Let's see how this life rolls</p>
                            </div>
                             </div>`
}
var htmltemplate={`
                <html>
                <head>
                 <title> ${title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="style.css">
                </head>
                <body>
               <div> <a href="/">Home</a></div>
                  <hr>
                <div class="container">
                <h3>Artivle-one</h3>
                <div>${heading}</div>
                <div>
                   ${content}
                </div>
                </div>
                </body>
                </html>`} */
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/article-one',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});
app.get('/ui/main.js',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'main.js'));
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
