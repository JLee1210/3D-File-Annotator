/*var http = require('http');
var fs = require('fs');

const PORT=8080; 

fs.readFile('./form.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});

fs.readFile('./form.js', function (err, html) {
    if (err) throw err;    
});

fs.readFile('./form.css', function (err, html) {
    if (err) throw err;    
});

console.log('Node server running on port 8080');  */
var express = require('express'),
    path = require('path'),
    app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static('Code'));

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on port: ' + app.get('port')); }
});