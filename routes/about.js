const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('about', {'title': 'About Us',
  'metadescription': 'Asp jobs about us section.',
  active: { about: true },
  });
});

module.exports = router;
