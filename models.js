"use strict";

const cnf = require("./config.json");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", null, null, {
    host: "localhost",
    dialect: "sqlite",
    storage: cnf.db
});

const Event = sequelize.define("event", {
    time: {
    	type: Sequelize.DATE, defaultValue: Sequelize.NOW
    },
    class: Sequelize.STRING(16),
    kind: Sequelize.STRING,
    point: Sequelize.INTEGER
});

module.exports = {
    Event
};
