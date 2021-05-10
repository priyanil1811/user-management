require("dotenv").config();

const config = {};

config.serverPort = 8080;
config.dbConfig = {
    user: "root",
    password: process.env.DB_PASSWORD,
    host: "localhost",
    port: 3306,
    database: "usersData",
};

module.exports = config;