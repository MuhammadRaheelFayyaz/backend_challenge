const { Router } = require('express');
const welcomeRoute = require('./welcome.route');
const customerRoute = require('./customer.route');
const productRoute = require('./product.route');
const shoppingCartRoute = require('./shoppingCart.route');
const shippingRoute = require('./shipping.route');
const taxRoute = require('./tax.route');
const attributeRoute = require('./attribute.route');

const routes = Router();

routes.use('/', welcomeRoute);
routes.use('/', customerRoute);
routes.use('/', productRoute);
routes.use('/', shoppingCartRoute);
routes.use('/', shippingRoute);
routes.use('/', taxRoute);
routes.use('/', attributeRoute);

module.exports = routes;
