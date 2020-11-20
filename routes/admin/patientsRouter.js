var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("进入后台");
});

module.exports = router;
