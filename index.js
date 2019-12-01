let express = require('express')
let app = express()
let multer = require('multer')
let upload = multer({ dest: 'uploads/' })
let request = require('request')
let port = process.env.PORT || 3000
let fs = require('fs');
let speech = require('@google-cloud/speech')
let client = new speech.SpeechClient()

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

  let file = fs.readFileSync(req.file.path)
  let audioRequest = {
    audio: {
      content: file.toString('base64')
    },
    config: {
      languageCode: 'en-US',
    }
  }
  console.log(file.toString('base64'))
  console.log('sending audio request...')
  client.recognize(audioRequest).then((data) => {
    console.log('request done!')
    console.log(data)
    const transcription = data.response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  })
})


let server = app.listen(port, () => console.log(`listening on port ${port}`))
