const express = require('express')
const path = require("path");
const ejs = require('ejs');
const ejsLayout = require("express-ejs-layouts");
const connection = require("./db");
// const route = express.Router();
const dotenv = require('dotenv');
var cookieParser = require("cookie-parser");
var session = require("express-session");
const cors = require("cors");
dotenv.config()
const app = express()
const port = 3000

const newPath = path.join(__dirname,"public")
app.use(express.static(newPath));
app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "layouts/layouts.ejs");
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors());
app.use(ejsLayout);

app.use(
  session({
    secret: process.env.secret,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(require("./middlewares/middlewar"));

// app.use(require("./middlewares/siteSetting"));
app.use("/", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

app.get('/', (req, res) => {
  res.render("home");
})

app.get('/about', (req, res) => {
    res.render('about')
  })

  app.get(
    "/weather",
    require("./middlewares/checkSessionAuth"),
    async (req, res) => {
      return res.render("weather");
    }
  );

  app.get("/dashboard",(req, res) => {
    return res.render("dashboard");
  });

  app.get("/cookie-test", (req, res) => {
    let views = req.cookies.views ? req.cookies.views : 0;
    views = Number(views) + 1;
    res.cookie("views", views);
    return res.send(`You Visited ${views} times`);
  });
  
  app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
  });
  


// app.get('*', (req, res) => {
//     res.render("404", { layout: "layouts/layout2.ejs" })
//  })
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let connection1 = async function db(){
  await connection();
}
connection1();
