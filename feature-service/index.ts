import dotenv from "dotenv";
import { listenForImages } from "./rabbitmq/consumeImageDetails";
import { listenForNotifications } from "./rabbitmq/consumeNotifications";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

listenForImages();
listenForNotifications();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
