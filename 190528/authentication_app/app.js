//modules
var express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  bodyParser = require("body-parser");

//model
var User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1/auth_demo_app", {
  useNewUrlParser: true
});

var app = express();
app.set("view engine", "ejs");

//express-session
app.use(
  require("express-session")({
    secret: "I want to marry japanese girl",
    resave: false,
    saveUninitialized: false
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//routes
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res) {
  res.render("secret");
});

//가입
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(error, user) {
      if (error) {
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secret");
      });
    }
  );
});

//로그인
app.get("/login", function(req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, "127.0.0.1", function() {
  console.log("Server Started.....");
});
