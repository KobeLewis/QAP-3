const { render } = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

// express app
const app = express();

// connect to mongodb
const dbURI =
  "mongodb+srv://KobeLewis:z9dekGovdH4I9Jcr@qap3.sbanqpo.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

//regist ejs
app.set("view engine", "ejs");

//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//ROUTES

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
// blog routes
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new Blog" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })

    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
