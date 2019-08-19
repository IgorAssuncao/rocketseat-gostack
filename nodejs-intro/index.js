const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (request, response) => {
  response.json({ message: `Hello, world!` });
});

app.get("/name", (request, response) => {
  const name = request.query.name;

  response.json({ message: `Hello, ${name}!` });
});

app.get("/users/:id", (request, response) => {
  const userId = request.params.id;

  response.json({ message: `Hello, ${userId}!` });
});

app.post("/users", (request, response) => {
  const userName = requset.body.name;

  response.json({ message: `Hello fom POST, ${name}` });
});

app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
});
