import app from './app';

const host = '0.0.0.0';
const port = 3000;

app.start = (HOST, PORT) => {
  return app.listen(PORT, HOST, () =>
    console.log(
      `${process.env.NODE_ENV.toUpperCase()} Server - API Running on ${HOST}:${PORT}`
    )
  );
};

app.start(host, port);
