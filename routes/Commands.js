const express = require('express');
const router = express.Router();
const commandsModel = require('../models/Commands');
const jwt = require('jsonwebtoken');

const auth = () => (req, res, next) => {
    if (!req.headers.authorization) {
      res.status(401).json({ success: false, message: "Token d'authentification non fourni." });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { login } = jwt.verify(token, 'SAM_S_SECRET');
      if (!login) {
        res.status(403).json({ success: false, message: "Votre compte n'a pas la permission pour réaliser cette action." });
        return;
      }
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Token d'authentification invalide." });
    }
  };

router.get('/commands', async (req, res) => {
    try {
      const commands = await commandsModel.find({});
      res.json(commands);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/commands/put-item', auth(), async (req, res) => {
    try {
        await commandsModel.updateOne({
            adress: req.body.adress
        },
            {
                $set: {
                    date: req.body.date,
                    cart: req.body.cart,
                    deliver: req.body.deliver,
                    totalPrice: req.body.totalPrice,
                    adress: req.body.adress,
                    user: req.body.user,
                }
            },
            { upsert: true }
        );
        res.status(200).json({ saved: true });
    } catch (err) {
        console.log(err)
        res.json(err);
    }
});

module.exports = router;