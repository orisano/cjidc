"use strict";

const cnf = require("./config.json");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", null, null, {
    host: "localhost",
    dialect: "sqlite",
    storage: cnf.db
});

const Event = sequelize.define("event", {
    time: Sequelize.DATE,
    grade: Sequelize.INTEGER,
    class: Sequelize.STRING(2),
    kind: Sequelize.STRING,
    point: Sequelize.INTEGER
});

module.exports = {
    Event
};
