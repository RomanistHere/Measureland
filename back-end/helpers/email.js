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

const verifiedTemplate =
`<div>
    <style>
        div {
            font-family: Verdana, sans-serif;
            color: #001A23;
        }
        a {
            display: block;
            margin: 10px 0;
            padding: 5px 0;
            color: #001A23;
            transition: color .2s;
        }
        a:hover {
            color: #ffa500;
        }
        h1 {
            font-size: 20px;
        }
        ul {
            list-style: square;
        }
    </style>
    <h1>
        Congratulations, your account is now verified!
    </h1>
    <p>
        Learn more about Measureland in our blog:
    </p>
    <ul>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/about-us/">About us. Our goals and mission.</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/tutorial/">Measureland guide book (tutorial).</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/terms-of-use/">Measureland Constitution. Part I. Terms of use.</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/policy/">Measureland Constitution. Part II. Privacy policy.</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/paid-options/">Measureland Constitution. Part III. Paid options.</a>
        </li>
    </ul>
    <p>
        Other useful links:
    </p>
    <ul>
        <li>
            <a target="_blank" href="mailto:RomanistHere@pm.me">Support, questions, feedback: RomanistHere@pm.me</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/">Measureland</a>
        </li>
        <li>
            <a target="_blank" href="https://github.com/RomanistHere/Measureland">GitHub</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/policy/">Twitter</a>
        </li>
        <li>
            <a target="_blank" href="http://localhost:8080/blog/paid-options/">Telegram</a>
        </li>
        <li>
            <a target="_blank" href="https://www.donationalerts.com/r/romanisthere">Donate</a>
        </li>
    </ul>
    <p>
        You can't unsubscribe because it's a single letter to help you get started. We won't send you anything else unless it's super-duper important. Have a nice day and see ya in Measureland!
    </p>
</div>`

const getHTML = (key, url, lang) => {
    const templatesHTML = {
        'en': {
            'Verify': `Here's your email verification link: <a href="${url}" target="_blank">${url}</a> - click or copy and paste into address bar.`,
            'Reset': `Here's your link for password changing: <a href="${url}" target="_blank">${url}</a>`,
            'Verified': verifiedTemplate,
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
