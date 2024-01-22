const express = require('express');
const router = express.Router();
const usersModel = require('../models/Users');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    },
  });
  
  transporter.verify(function (error, success) {
    if (error) {
      console.error(error);
    } else {
      console.log('Le serveur est prêt à recevoir nos messages');
    }
  });

  const mailOptions = {
    from: "samuel.monin2003@gmail.com",
    to: "jean.dupuis454545@gmail.com",
    subject: "Test du mail",
    html: "Le mail que l'on veut <a href='http://localhost:3000'>tester</a>."
};


router.get('/users', async (req, res) => {
    try {
      const users = await usersModel.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/users/put-item', async (req, res) => {

    try {

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log("Email envoyé")
            }
        });


        await usersModel.updateOne({
            login: req.body.login
        },
            {
                $set: {
                    login: req.body.login,
                    password: req.body.password,
                    mail: req.body.mail,
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
