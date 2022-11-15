const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 8080

app.use(cors());

let productionOrigin = "https://chat-app-pushkar.vercel.app/";
let developmentOrigin = "http://localhost:3000/";

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "https://chat-app-pushkar.vercel.app");
	res.header(
	  "Access-Control-Allow-Headers",
	  "Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
  });

const server = http.createServer(app);

app.get(`/`, (req, res) => {
	res.send("the chatbackend is up and running");
})

const io = new Server(server, {
    cors : {
		
		origin : developmentOrigin,
		methods : ["GET", "POST"],
		credentials : true,
		transports : [`websocket`, `polling`]
}, allowEIO3 : true,
});

// variable to increment messageId.
let nextId = 0;

io.on("connection", (socket) => {
	console.log(`user connected : ${socket.id} `);

	// when the user joins the room
	socket.on("joinRoom", (roomId) => {
		console.log(`user with Id : ${socket.id} joined the room : ${roomId}`)
	})

	// when error happens
	socket.on("error", (err) => {
		console.log("error on the server -> " + err);
	})

	// listening to the chat 
	socket.on("sendMessage", (data) => {
		// console.log(data);
		// socket.emit("get_message", data);
		data["id"] = nextId;
		socket.broadcast.emit("get_message", data);
		nextId = nextId + 1;
	})

	// when the user disconnects
	socket.on("disconnect", () => {
		console.log(`user disconnected -> ${socket.id}`)
	})

	// if an error happens
	socket.on("error", (err) => {
		console.log(err);
	})
})

server.listen(PORT, console.log("server up and running"));


