import app from "./app";

const port = 3000;

app.start = port => {
  return app.listen(port, () => console.log(`API Running on ${port}`));
};

app.start(port);
