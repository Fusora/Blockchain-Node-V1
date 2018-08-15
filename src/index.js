const express = require('express')
const bodyParser = require('body-parser');

const app = express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.set('Hello World')
})

app.listen(3000)
