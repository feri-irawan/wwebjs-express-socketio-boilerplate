import { app, io, server } from "./server";
import { client, status } from "./wa";
import {
  indexRouteHandler,
  sendRouteHandler,
  broadCastRouteHandler,
} from "./routeHandlers";

io.on("connection", () => {
  io.emit("status", status);
});

app.get("/", indexRouteHandler);
app.post("/send", sendRouteHandler);
app.post("/broadcast", broadCastRouteHandler);

// listen on port 3000
server.listen(3000, () => {
  client.initialize();
  console.log("Server listening on port 3000");
});
