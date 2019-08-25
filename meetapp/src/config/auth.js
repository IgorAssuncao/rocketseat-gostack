export default {
  secret: !process.env.JWT_TOKEN
    ? '473e4a25b12a488e809bb9a62bd8ae8a8303a7d975a37d49307e28ead9566806'
    : process.env.JWT_TOKEN,
  expiresIn: '7d',
};
