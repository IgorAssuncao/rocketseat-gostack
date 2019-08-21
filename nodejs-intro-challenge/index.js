const express = require("express");

const routes = require("./routes");

const app = express();

let requestsCounter = 0;

function incrementRequestsCounter(request, response, next) {
  requestsCounter++;

  console.log(
    `Method: ${request.method} - URL: ${
      request.url
    } - Requests Counter: ${requestsCounter}`
  );

  return next();
}

app.use(express.json());

app.use(incrementRequestsCounter);

app.use(routes);

app.start = () => {
  return app.listen(3000, () => console.log("API Running on localhost:3000"));
};

app.start();
