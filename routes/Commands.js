const express = require('express');
const router = express.Router();
const commandsModel = require('../models/Commands');

router.get('/commands', async (req, res) => {
    try {
      const commands = await commandsModel.find({});
      res.json(commands);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/commands/put-item', async (req, res) => {

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