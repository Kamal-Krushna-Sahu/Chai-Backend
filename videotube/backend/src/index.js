import "dotenv/config"; // or use the configuration method written below.
// import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

/*
  dotenv.config({
    path: "./.env",
  });
*/

const port = process.env.PORT || 3001;

connectDB() //DATABASE Connection
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`MONGODB connection failed !`, err);
  });
