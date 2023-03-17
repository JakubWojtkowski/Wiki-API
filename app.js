const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/wikiDB");

// schema model 
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.get('/articles', (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

app.post('/articles', (req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save((err) => {
        if (!err) {
            res.send("Succesfully added a new article.");
        } else {
            res.send(err);
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});