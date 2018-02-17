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
app.use(bodyParser.urlencoded({extended : true}));

passport.use(new LocalStratergy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());





//========================================================
//ROUTES
//========================================================

app.get('/',function (req, res) {
   res.render("home");
});

app.get('/secret',isLoggedIn,function (req, res) {
   res.render("secret")
});


//========================================================
//AUTH ROUTES
//========================================================

app.get("/register",function (req, res) {
   res.render("register");
});

app.post("/register",function (req, res) {
    Users.register(new Users({username : req.body.username}), req.body.password,function (err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res,function () {
           res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
app.get("/login",function (req, res) {
   res.render("login");
});
//middleware
app.post("/login",passport.authenticate("local",{
        successRedirect : "/secret",
        failureRedirect : "/login"
    }),function (req, res) {
});

//LOGOUT ROUTE
app.get("/logout",function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

app.listen(3000, function () {
   console.log("Auth Demo started on port 3000");
});