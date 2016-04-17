"use strict";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const passport = require("passport");
const Strategy = require("passport-http").BasicStrategy;
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const logger = require("morgan");
const sqlite3 = require("sqlite3").verbose();

const cnf = require("./config");
// const db = new sqlite3.Database(cnf.db);

server.listen(cnf.port);

passport.use(new Strategy((user, pass, done) => {
    if (cnf.user !== user || cnf.pass !== pass) {
        done(null, false);
    }
    done(null, true);
}));

const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "pug");

app.get("/", (req,res) => {
    res.render("index");
});

app.get("/admin",
    passport.authenticate("basic", {session: false}),
    csrfProtection,
    (req, res) => {
        res.render("admin", {kinds: ["A", "B", "C"]});
    }
);

app.post("/score", parseForm, csrfProtection, (req, res) => {
    
});

io.on("connection", (socket) => {

});
