var express = require('express');
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
   res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/send2phone', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/send2phone.html'));
});

router.get('/privacy', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/privacy.html'));
});

module.exports = router;
