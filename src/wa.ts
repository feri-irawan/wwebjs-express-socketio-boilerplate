import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import { io } from "./server";
import config from "../config";

export let qrBase64: string | null = null;
export let status: "ready" | "pending" | "unauthenticated" | "authenticated" =
  "pending";

export const client = new Client({
  authStrategy: new LocalAuth({ clientId: config.sessionName || "my-session" }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", async (qr) => {
  status = "unauthenticated";
  qrBase64 = await qrcode.toDataURL(qr);

  io.emit("status", status);
  io.emit("qr", qrBase64);
});

client.on("authenticated", (session) => {
  status = "authenticated";
  io.emit("status", status);
  io.emit("session", session);
});

client.on("ready", () => {
  status = "ready";
  io.emit("status", status);
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  console.log(JSON.stringify(msg, null, 2));

  if (msg.id.fromMe) return;

  if (msg.body === "!ping") {
    msg.reply("pong!");
  } else {
    msg.reply("Hello!");
  }
});
