// change history
// hs002 implement the event bus communication
//   when a new post is generated the post info will be sent via http req. to the eventbus service
//   listening on port 4005
// hs003 implement type ComnmnentUpdated

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
// required to handle the request body
app.use(express.json());

const axios = require("axios");

// add mqtt support
var mqtt = require("mqtt");
var Topic = "postapp/+"; //subscribe to all topics from postapp
//var Broker_URL = 'mqtt://192.168.1.123';
//var Broker_URL = 'mqtt://test.mosquitto.org';
var Broker_URL = "mqtt://mqtt:1883";

var options = {
  clientId: "MyMQTT",
  port: 1883,
  keepalive: 60,
};

var client = mqtt.connect(Broker_URL, options);
client.on("connect", mqtt_connect);
client.on("reconnect", mqtt_reconnect);
client.on("error", mqtt_error);
client.on("message", mqtt_messsageReceived);
client.on("close", mqtt_close);

function mqtt_connect() {
  console.log("Connecting MQTT");
  client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted) {
  console.log("Subscribed to " + Topic);
  if (err) {
    console.log(err);
  }
}

function mqtt_reconnect(err) {
  console.log("Reconnect MQTT");
  if (err) {
    console.log(err);
  }
  client = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err) {
  console.log("Error!");
  if (err) {
    console.log(err);
  }
}

function after_publish() {
  //do nothing
}
jsonmsg = {};
function mqtt_messsageReceived(topic, message, packet) {
  console.log("Topic=" + topic + "  Message=" + message);
  if (topic === "postapp/PostCreated") {
    jsonmsg = JSON.parse(message);
    const { id, title } = jsonmsg;
    posts[id] = { id, title, comments: [] };
  }
}

function mqtt_close() {
  console.log("Close MQTT");
}

const posts = {};

// hs006 restructure
const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  console.log(posts);
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  // hs006 restructure
  handleEvent(type, data);
  console.log(posts);
  res.send({});
});

// hs006 - get all events at startup (async)
app.listen(4002, async () => {
  console.log("Listening on 4002");
  // hs006 - get all events at startup
  try {
    const res = await axios.get("http://eventbus:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
