import express from 'express';
import bodyParser from 'body-parser';

const app = express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.set('Hello World')
});

app.listen(3000, ()=>console.log('Running at port 3000'))
