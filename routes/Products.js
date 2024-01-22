const express = require('express');
const router = express.Router();
const productsModel = require('../models/Products');

router.get('/products', async (req, res) => {
    try {
      const products = await productsModel.find({});
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;