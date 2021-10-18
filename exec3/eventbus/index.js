const express = require("express");
const axios = require("axios");

const app = express();

// required to handle the request body
app.use(express.json());

// hs006 add code to store the events received
const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  // hs006 add code to store the events received
  events.push(event);
  // hs006 catch error when service is not up
  axios.post("http://posts:4000/events", event).catch((err) => {
    console.log(err.message); //this is the post service
  });
  axios.post("http://comments:4001/events", event).catch((err) => {
    console.log(err.message); //this is the comment service
  });
  axios.post("http://query:4002/events", event).catch((err) => {
    console.log(err.message); //this is the query service
  });
  axios.post("http://moderation:4003/events", event).catch((err) => {
    console.log(err.message); //this is the moderation service
  });
  res.send({ status: "ok event rec. and forwarded" });
  console.log("post request on event bus rec.", event);
});

// hs006 add code to store the events received and return the events list when a get request is received
app.get("/events", (req, res) => {
  console.log(events);
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening to 4005");
});
