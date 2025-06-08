import "dotenv/config";
import express from "express";
// import cors from "cors"

const app = express();
const port = process.env.PORT || 3001;

// app.use(cors())

app.get("/", (req, res) => {
  res.send("hello Bads");
});

app.get("/api/profile", (req, res) => {
  const profile = {
    name: "Bads",
    age: 20,
    gender: "NA",
    email: "bads@gmail.com",
  };
  res.json(profile);
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
