const Router = require('express');
const routes = require('./api');

const router = Router();

router.use('/', routes);

module.exports = router;
