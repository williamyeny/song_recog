let express = require('express')
let app = express()
let port = process.env.PORT || 3000

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/',function(req,res) {
  res.render('index')
})

let server = app.listen(port, () => console.log(`listening on port ${port}`))
