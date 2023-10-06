// Import necessary modules
const express = require("express"); // Express.js for web application framework
const bodyParser = require("body-parser"); // Middleware to parse request data
const ejs = require("ejs"); // Template engine for rendering views
const mongoose = require("mongoose"); // MongoDB ODM (Object Document Mapper)

// Create an instance of the Express application
const app = express();

// Set the view engine to EJS for rendering templates
app.set("view engine", "ejs");

// Configure middleware to handle URL-encoded data
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Serve static files like CSS and images from the 'public' directory
app.use(express.static("public"));

// Connect to the MongoDB server with the 'wikiDB' database
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
});

// Define the schema for articles that defines their structure
const articleSchema = {
  title: String,
  content: String,
};

// Create a model 'Article' based on the articleSchema
const Article = mongoose.model("Article", articleSchema);

// Define route handlers using app.route to reduce code duplication

///////////Requests Targeting all Articles/////////////
app
  .route("/articles")
  // GET request to fetch all articles
  .get(function (req, res) {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  // POST request to create a new article
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then((savedArticle) => {
        res.send("Successfully save the article" + savedArticle);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  // DELETE request to delete all articles
  .delete(function (req, res) {
    Article.deleteMany({})
      .then((deletedArticles) => {
        res.send("Successfully deleted all the articles" + deletedArticles);
      })
      .catch((err) => {
        res.send(err);
      });
  });

///////////Requests Targeting all Articles/////////////

app
  .route("/articles/:articleTitle")
  // GET request to fetch a specific article by title
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No matching article was found ");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  })
  // PUT request to update a specific article by title
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    )
      .then(() => {
        res.status(200).send("Update Successful");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })
  // PATCH request to partially update a specific article by title
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    )
      .then(() => {
        res.status(200).send("Successfully updated the requested article");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })
  // DELETE request to delete a specific article by title
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.status(200).send("Successfully deleted the document");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

// Spin up the server on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
