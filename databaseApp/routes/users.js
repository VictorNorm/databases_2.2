var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
const sql = require("mysql2");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const pool = new sql.createPool({
  database: "databaseapp",
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Kjellduel6!",
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  pool.query("SELECT * FROM Users", (err, result) => {
    console.dir(result);
    res.end();
  });
  let users = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf-8")
  );
  res.render("users", { users: users });
});

router.post("/", jsonParser, function (req, res, next) {
  let toAddArray = req.body.users;
  const query =
    "INSERT INTO Users(FirstName, LastName) VALUES " +
    toAddArray
      .map(
        (user) =>
          "(" +
          "'" +
          user.FirstName +
          "'" +
          "," +
          "'" +
          user.LastName +
          "'" +
          ")"
      )
      .toString();
  console.log(query);
  pool.query(query, (err, data) => {
    console.dir(data);
    res.end();
  });
});

module.exports = router;
