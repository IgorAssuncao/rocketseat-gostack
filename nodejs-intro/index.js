const express = require("express");

const app = express();

const PORT = 3000;

const users = ["Igor", "Alex", "Muca", "Marcia"];

app.use(express.json());

function checkUserInArray(request, response, next) {
  const user = users[request.params.index];

  if (!user) {
    return response.status(400).json({ error: "User does not exists" });
  }

  request.user = user;

  return next();
}

function checkUserExists(request, response, next) {
  if (!request.body.name) {
    return response
      .status(400)
      .json({ error: "User not found on request body" });
  }

  return next();
}

app.use((request, reponse, next) => {
  console.log(`Method: ${request.method}, URL: ${request.url}`);

  return next();
});

app.get("/", (request, response) => {
  response.json({ message: `Hello, world!` });
});

app.get("/name", (request, response) => {
  const name = request.query.name;

  response.json({ message: `Hello, ${name}!` });
});

app.get("/users", (request, response) => {
  return response.json(users);
});

app.get("/users/:index", checkUserInArray, (request, response) => {
  return response.json({ message: `Hello, ${request.user}!` });
});

app.post("/users", checkUserExists, (request, response) => {
  const userName = request.body.name;

  users.push(userName);

  response.json({
    message: `Hello fom POST, ${userName}`,
    users
  });
});

app.put(
  "/users/:index",
  checkUserInArray,
  checkUserExists,
  (request, response) => {
    const userIndex = request.params.index;
    const userName = request.body.name;

    users[userIndex] = userName;

    return response.json({
      message: `User ${userIndex} updated!`,
      users
    });
  }
);

app.delete("/users/:index", checkUserInArray, (request, response) => {
  const userIndex = request.params.index;

  users.splice(userIndex, 1);

  return response.send();
});

app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
});
