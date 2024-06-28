const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
	console.log(`Server is live on port ${port}`);
});
const io = require("socket.io")(server);

let socketsConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
	// console.log("Socket connected " + socket.id);
	socketsConnected.add(socket.id);
	io.emit("ClientsTotal", socketsConnected.size);
	socket.on("disconnect", () => {
		socketsConnected.delete(socket.id);
		io.emit("ClientsTotal", socketsConnected.size);
		// console.log("Socket disconnected ", socket.id);
	});
	socket.on("message", (data) => {
		socket.broadcast.emit("chat-message", data);
	});
	socket.on("feedback", (data) => {
		socket.broadcast.emit("feedback", data);
	});
}
