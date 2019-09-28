const { Router } = require('express');
const ShippingController = require('../../controllers/shipping.controller');

const router = Router();

router.get('/shipping/regions', ShippingController.getShippingRegions);
router.get('/shipping/regions/:shipping_region_id', ShippingController.getShippingType);

module.exports = router;
