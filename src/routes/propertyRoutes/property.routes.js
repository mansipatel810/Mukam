const propertyController = require('../../controllers/propertyController/property.controller')
const authMiddleware = require('../../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/create',authMiddleware,propertyController.createProperty);
router.get('/view/:id',authMiddleware,propertyController.viewProperty);
router.get('/delete/:id',authMiddleware,propertyController.deleteProperty);
router.put('/update/:id',authMiddleware,propertyController.updateProperty);
router.post('/search',authMiddleware,propertyController.searchProperty);


module.exports = router;