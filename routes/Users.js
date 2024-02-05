const express = require('express');
const router = express.Router();
const usersModel = require('../models/Users');
const codeValidationModel = require('../models/CodeValidation');


const nodemailer = require('nodemailer');

const crypto = require('crypto');

function generateEightDigitCode() {

    let randomCode = Math.floor(crypto.randomInt(10000000, 100000000));
    return randomCode;
  }
  


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


router.get('/users', async (req, res) => {
    try {
      const users = await usersModel.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/users/send-mail', async (req, res) => {

    try {

        let securityKey = generateEightDigitCode();

        const currentDate = new Date();

        const mailOptions = {
            from: "samuel.monin2003@gmail.com",
            to: "jean.dupuis454545@gmail.com",
            subject: "Test du mail",
            html: `<p>Voici votre code : ${securityKey}</p>`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log("Email envoyé")
            }
        });

        await codeValidationModel.updateOne({
            code: securityKey
        },
            {
                $set: {
                    code: securityKey,
                    createdAt: currentDate
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




router.post('/users/put-item', async (req, res) => {

    try {

        console.log("1");

        console.log("req.body", req.body);

        const codesObject = await codeValidationModel.find({});

        console.log("2");

        let isValidCode = false;

        codesObject.forEach(codeObject => {
            console.log("codeObject.code : ", codeObject.code)
            console.log("req.body.code : ", req.body.code)
            if(codeObject.code.toString() === req.body.code.toString()) {
                isValidCode = true;
            }
            console.log("isValidCode : ", isValidCode)
        });

        console.log("isValidCode : ", isValidCode)

        if (isValidCode) {
            console.log("4");
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

            res.status(200).json({ saved: true, isValidCode: isValidCode });
        } else {
            res.status(200).json({ isValidCode: isValidCode });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});




module.exports = router;
