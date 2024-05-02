import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
