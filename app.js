const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const config = require("./config");
const fileUpload = require('express-fileupload');

const app = express();
const router = express.Router();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


// DB Setup
const connection = mysql.createConnection({
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    database: config.dbConfig.database,
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Connected to db");

    connection.query("SHOW TABLES", (err, result) => {
        if (err) {
            throw err;
        }
    });
});

router.get("/", function (req, res) {
    const query = "SELECT * FROM users ORDER BY id ASC";

    connection.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.render("index", { users: result });
    });
});

router.get("/user/:id", function (req, res) {
    const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

    connection.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.render("update-user", { userInfo: result[0] });
    });
});

router.get("/add-user", function (req, res) {
    res.render("add-user");
});

router.post("/add-user-complete", function (req, res) {

    console.log(req.files)
    var file = req.files.profile_img;
    var img_name = file.name;

    file.mv('public/img/'+img_name, function(err) {

        if (err)
            console.log(err);
    });

    const query = `INSERT INTO users (first_name, last_name, email, profile_img) VALUES ("${req.body.first_name}", "${req.body.last_name}", "${req.body.email}", "${img_name}")`;

    connection.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.writeHead(302, {
            Location: "/",
        });
        res.end();
    });
});

router.post("/update-user", function (req, res) {
    const query = `UPDATE users SET first_name = "${req.body.first_name}", last_name = "${req.body.last_name}", email = "${req.body.email}" WHERE id = "${req.body.id}"`;

    connection.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.writeHead(302, {
            Location: "/",
        });
        res.end();
    });
});

router.post("/delete-user", function (req, res) {
    const query = `DELETE FROM users WHERE id = ${req.body.id}`;

    connection.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.writeHead(302);
        res.end();
    });
});


app.use("/", router);

app.listen(config.serverPort, () => {
    console.log(config.serverPort);
})




