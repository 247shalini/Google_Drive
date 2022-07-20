require('dotenv').config()
const routes = require("./routes");
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require("body-parser");
const  path  = require('path');
const session = require('express-session');
const Handlebars = require('handlebars');
const flash = require("connect-flash");
const { default: mongoose } = require("mongoose");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express(); 
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// connect flash code
app.use(session({
  secret:"flash session is use for error",
  resave:false,
  saveUninitialized:true
}))
app.use(flash());

// handlebars code
app.engine(".hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
})
)

app.set("view engine", ".hbs"); 
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.join(__dirname, "views")) 

// public and upload folder path
const static_path = path.join(__dirname, "./public");
const image_path = path.join(__dirname, "./uploads");
app.use(express.static(static_path));
app.use(express.static(image_path));

app.use(routes);
app.use(express.json()); 

// create server
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

// connect database
mongoose 
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully.."))
  .catch(console.log);