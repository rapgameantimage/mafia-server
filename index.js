"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg-promise")();
const db = pg({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const app = express();
app.use(bodyParser.json());

app.post("/events/start", (req, res, next) => {
  db.none("INSERT INTO games (id, start_time) VALUES ($1, $2);", [req.body.game_id, new Date()]).then(() => {
    const promises = [];
    for (let steamid in req.body.roles) {
      promises.push(db.none("INSERT INTO game_roles (steam_id, rolename, game_id) VALUES ($1, $2, $3);", [steamid, req.body.roles[steamid], req.body.game_id]));
    }
    return Promise.all(promises)
  }).then(() => res.end()).catch(next);
});

app.post("/events/end", (req, res, next) => {
  db.none("UPDATE games SET complete=true, winner=$1, end_time=$2 WHERE game_id=$3", [req.body.winner, new Date(), req.body.game_id]).then(() => res.end()).catch(next);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).end();
})

app.listen(process.env.PORT || 8080);