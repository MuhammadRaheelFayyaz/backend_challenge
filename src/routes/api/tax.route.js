const { Router } = require('express');
const TaxController = require('../../controllers/tax.controller');

const router = Router();

// These are valid routes but they may contain a bug, please try to define and fix them

router.get('/tax', TaxController.getAllTax);
router.get('/tax/:tax_id', TaxController.call);

module.exports = router;
