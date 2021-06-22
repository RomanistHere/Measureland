require('dotenv').config()
const mailgun = require("mailgun-js")({
    apiKey: process.env.MAILGUN_API,
    domain: process.env.MAILGUN_DOMAIN
});

const templatesSubject = {
    'en': {
        'Verify': `Verify your email address`,
        'Reset': `Reset password`,
        'Verified': `Welcome to Measureland`,
    },
    'ru': {
        'Verify': `Подтверждение почты`,
        'Reset': `Сброс пароля`,
        'Verified': `Добро пожаловать в Измерию`,
    }
}

const getHTML = (key, url, lang) => {
    const templatesHTML = {
        'en': {
            'Verify': `Here's your email verification link: <a href="${url}" target="_blank">${url}</a> - click or copy and paste into address bar.`,
            'Reset': `Here's your link for password changing: <a href="${url}" target="_blank">${url}</a>`,
            'Verified': `Congratulations, your account is now verified!`,
        },
        'ru': {
            'Verify': `Ссылка для верификации: <a href="${url}" target="_blank">${url}</a> - нажми или скопируй и вставь в адресную строку.`,
            'Reset': `Here's your link for password changing: <a href="${url}" target="_blank">${url}</a>`,
            'Verified': `Поздравляем, аккаунт подтверждён!`,
        }
    }

    return templatesHTML[lang][key]
}

exports.sendEmail = async (data) => {
    const { email, lang, verificationUrl, reason } = data
    const mail = {
        to: email,
        from: 'Measureland-kingdom-mail-service@mail.com',
        html: getHTML(reason, verificationUrl, lang),
        subject: templatesSubject[lang][reason]
    }

    return await mailgun.messages().send(mail);
}
