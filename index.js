var express = require('express');
var bodyParser = require('body-parser');
var request = require('superagent');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

  var mailchimpInstance   = 'us21',
    listUniqueId        = '4c420fafe7',
    mailchimpApiKey     = 'af0c20b3abfe0d6ac6b06a0a1bdb8797-us21';

app.post('/signup', function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer.from('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': req.body.first,
            'LNAME': req.body.last
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname + "/success.html");
              } else {
                res.sendFile(__dirname + "/failure.html");
              }
          });
});

app.post('/success', function(req,res){
  res.redirect("/");
});

app.post('/failure', function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT ||3000, function () {
  console.log('Example app listening on port 3000!');
});

//af0c20b3abfe0d6ac6b06a0a1bdb8797-us21
//4c420fafe7
