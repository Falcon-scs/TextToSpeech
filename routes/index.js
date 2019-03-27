var express = require('express');
var router = express.Router();
var mainController = require('../controllers/mainController')
var main = new mainController();

router.get('/', main.index);
router.post('/uploadText', main.uploadText)
router.post('/removeFile', main.removeFile);

module.exports = router;
