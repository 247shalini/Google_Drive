require('dotenv').config()
const routes = require("./routes");
const express = require('express');
const { engine } = require('express-handlebars');
const  path  = require('path');
const session = require('express-session');
const { default: mongoose } = require("mongoose");

const app = express(); 
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// handlebars code
app.engine(".hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
})
)
app.set("view engine", ".hbs"); 
app.use(express.urlencoded({ extended: false }))
app.set("views", path.join(__dirname, "views")) 

// public folder path
const static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));

app.use(routes);
app.use(express.json());

// create server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

// connect database
mongoose 
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully.."))
  .catch(console.log);

