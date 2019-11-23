let express = require('express')
let app = express()
let multer = require('multer')
let upload = multer({ dest: 'uploads/' })
let request = require('request')
let port = process.env.PORT || 3000
let fs = require('fs');

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/upload', upload.single('audio'), function (req, res) {
  console.log(req.file)
  let data = {
    'file': fs.createReadStream(req.file.path),
    'api_token': process.env.AUDD_TOKEN
  };
  console.log(data)
  request({
    uri: 'https://api.audd.io/',
    formData: data,
    method: 'POST'
  }, function (err, resp, body) {
    console.log(body)
    res.json(body)
  });
})


let server = app.listen(port, () => console.log(`listening on port ${port}`))
