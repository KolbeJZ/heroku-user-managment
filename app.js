
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const db = require('./queries');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', db.createUser);

app.get('/table', db.displayUsers);

app.post('/table', db.deleteUser);

app.get('/sortOY', db.sortOY);

app.get('/sortYO', db.sortYO);

app.post('/search', db.search);

app.get('/edit/:userId', db.getUser);

app.post('/edit/:userId', db.editUser);

app.listen(port, () => {
    console.log(`Listening To Port: ${port}`)
});