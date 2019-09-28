const { Router } = require('express');

const welcomeRoute = Router();

welcomeRoute.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      'Welcome to Turing E-commerce shop api, your goal is to implement the missing code or fix the bugs inside this project',
  });
});

module.exports = welcomeRoute;
