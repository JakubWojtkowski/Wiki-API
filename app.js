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

app.route('/articles')
    .get('/articles', (req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post('/articles', (req, res) => {
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
    })

    .delete('/articles', (req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Succesfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});