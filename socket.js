import io from "socket.io-client";

const socket = io("ws://almacne-iot.us-east-1.elasticbeanstalk.com");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("open", (data) => {
  //console.log(data);
});

if (!global.socket) {
  global.socket = socket;
}

socket.on("disconnect", () => {
  console.log("disconnected");
  // reconnect automatically
  socket.connect();
});

export default socket;
