var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    Users                   = require("./models/user"),
    LocalStratergy          = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();

app.use(require("express-session")({
    secret : "Rusty is the best and the cutest dog in the world",
    resave : false,
    saveUninitialized : false
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


app.get('/',function (req, res) {
   res.render("home");
});

app.get('/secret',function (req, res) {
   res.render("secret")
});

app.listen(3000, function () {
   console.log("Auth Demo started on port 3000");
});