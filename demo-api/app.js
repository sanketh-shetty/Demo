var express = require("express");
var app = express();

const axios = require("axios");
var request = require("request");

var cors = require("cors");
var Constants = require("./Constants");

app.use(cors());



app.get("/", (req, res) => {
  req.send("Test!!");
});

app.get("/users", (req, res) => {
  getUsers(req, res);
});

getUsers = async (req, res) => {
  axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log("error",error);
    });
};

app.listen(Constants.PORT, () => {
  console.log(`Running @ localhost:${Constants.PORT}`);
});
