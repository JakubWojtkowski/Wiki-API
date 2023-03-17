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

///////////////////////////////// Requests Targetting All Articles

app.route('/articles')
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
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

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Succesfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

///////////////////////////////// Requests Targetting A Specific Article

app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArtice) => {
            if (!err) {
                res.send(foundArtice);
            } else {
                res.send("No articles matching was found.");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },
            (err) => {
                if (!err) {
                    res.send("Succesfully updated article.");
                } else {
                    res.send(err);
                }
            })
    })

    .patch((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            (err) => {
                if (!err) {
                    res.send("Succesfully updated article.");
                } else {
                    res.send(err);
                }
            });
    })

    .delete((req, res) => {
        Article.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            if (!err) {
                res.send("Succesfully deleted an article.");
            } else {
                res.send(err);
            }
        });
    });

// Listening

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});