const express = require('express');
const router = express.Router();
const usersModel = require('../models/Users');
const codeValidationModel = require('../models/CodeValidation');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function generateEightDigitCode() {
    let randomCode = Math.floor(crypto.randomInt(10000000, 100000000));
    return randomCode;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numberRegex = /^[0-9]+(\.[0-9]+)?$/;

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

//inutile actuellement
router.get('/users', async (req, res) => {
    try {
      const users = await usersModel.find({});
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password ) {
            return res.status(400).json({ message: "Saisissez vos identifiants." });
        }
        const user = await usersModel.findOne({ login });
        if (!user) {
            return res.status(401).json({ message: "Login incorrect." });
        }
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword !== user.password) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        let token = jwt.sign(
            {
                id: user._id,
                login: login,
            },
            "SAM_S_SECRET",
            { expiresIn: "3 days" }
        );
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

router.post('/users/send-mail', async (req, res) => {
    try {
        const { login, mail, password, passwordConfirmation } = req.body;
        if (!login || !password) {
            return res.status(400).json({ message: "Saisissez tous les champs." });
        }
        if (password !== passwordConfirmation) {
            return res.status(400).json({ message: "Les mots de passe saisies sont différents." });
        }
        if (!emailRegex.test(mail)) {
            return res.status(400).json({ message: "Le mail n'est pas aux bon format (Ex: john.doe@gmail.com)." });
        }
        let securityKey = generateEightDigitCode();
        const currentDate = new Date();
        const mailOptions = {
            from: "samuel.monin2003@gmail.com",
            to: req.body.mail,
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
                    code: securityKey.toString(),
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
        console.log(1)
        console.log("code : ", req.body.code)
        if (!numberRegex.test(req.body.code)) {
            return res.status(400).json({ message: "Le format du code est incorrect." });
        }
        console.log(2)
        console.log("req.body.code : ", req.body.code)
        const codeObject = await codeValidationModel.findOne({ code: req.body.code });
        console.log("codeObject : ", codeObject)
        if(!codeObject) {
            return res.status(401).json({ message: "Code invalide ou expiré." });
        }
        console.log(4)
        const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
        await usersModel.updateOne({
            login: req.body.login
        },
        {
            $set: {
                login: req.body.login,
                password: hashedPassword,
                mail: req.body.mail,
            }
        },
        { upsert: true }
        );
        console.log(5)
        res.status(200).json({ saved: true });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;