require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API,
	url: 'https://api.eu.mailgun.net',
});

const isProd = process.env.IS_PROD === '1';
const siteURL = isProd ? process.env.SITE_URL : process.env.SITE_URL_DEV;

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
	},
};

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
        Congratulations, your account is verified, go and rate now!
    </h1>
    <p>
        Learn more about Measureland in our blog:
    </p>
    <ul>
        <li>
            <a target="_blank" href="${siteURL}/en/blog/about-us/">About us. Our goals and mission.</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/en/blog/tutorial/">Measureland guide book (tutorial).</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/en/blog/terms-of-use/">Measureland Constitution. Part I. Terms of use.</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/en/blog/policy/">Measureland Constitution. Part II. Privacy policy.</a>
        </li>
    </ul>
    <p>
        Other useful links:
    </p>
    <ul>
        <li>
            <a target="_blank" href="mailto:support@measureland.org">Support, questions, feedback: support@measureland.org</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/en/">Measureland</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/en/community/">Community</a>
        </li>
        <li>
            <a target="_blank" href="https://github.com/RomanistHere/Measureland">GitHub</a>
        </li>
        <li>
            <a target="_blank" href="https://discord.gg/PBrXUhqJhC">Discord</a>
        </li>
        <li>
            <a target="_blank" href="https://t.me/measureland">Telegram</a>
        </li>
        <li>
            <a target="_blank" href="https://opencollective.com/measureland">Open Collective</a>
        </li>
    </ul>
    <p>
        You can't unsubscribe because it's a single letter to help you get started. We won't send you anything else unless it's super-duper important. Have a nice day and see ya in Measureland!
    </p>
</div>`;

const verifiedTemplateRus =
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
        Поздравляем, аккаунт подтверждён, пять Измеринок из пяти!
    </h1>
    <p>
        Узнать больше про Измерию:
    </p>
    <ul>
        <li>
            <a target="_blank" href="${siteURL}/ru/blog/about-us/">О нас. Наши цели и миссия.</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/ru/blog/tutorial/">Путеводитель по Измерии (туториал).</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/ru/blog/terms-of-use/">Конституция Измерии. Условия использования.</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/ru/blog/policy/">Конституция Измерии. Конфиденциальность.</a>
        </li>
    </ul>
    <p>
        Другие полезные ссылки:
    </p>
    <ul>
        <li>
            <a target="_blank" href="mailto:support@measureland.org">Поддержка, вопросы, обратная связь: support@measureland.org</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/ru/">Измерия</a>
        </li>
        <li>
            <a target="_blank" href="${siteURL}/en/community/">Сообщество</a>
        </li>
        <li>
            <a target="_blank" href="https://github.com/RomanistHere/Measureland">GitHub</a>
        </li>
        <li>
            <a target="_blank" href="https://t.me/measureland_ru">Телеграм</a>
        </li>
        <li>
            <a target="_blank" href="https://discord.gg/PBrXUhqJhC">Discord</a>
        </li>
        <li>
            <a target="_blank" href="https://opencollective.com/measureland">Open Collective</a>
        </li>
    </ul>
    <p>
        От этой рассылки нельзя отписаться (unsubscribe), потому что это не рассылка, а единичное письмо. Мы не будем ничего больше посылать, только если что-то супер-пупер важное. Хорошего дня и увидимся в Измерии!
    </p>
</div>`;

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
			'Verified': verifiedTemplateRus,
		},
	};

	return templatesHTML[lang][key];
};

const templateFrom = {
	'en': `Measureland mail service support@${process.env.MAILGUN_DOMAIN}`,
	'ru': `Измерийская почтовая служба support@${process.env.MAILGUN_DOMAIN}`,
};

exports.sendEmail = async data => {
	const { email, lang, verificationUrl, reason } = data;
	const mail = {
		to: `${email}`,
		from: templateFrom[lang],
		html: getHTML(reason, verificationUrl, lang),
		subject: templatesSubject[lang][reason],
	};

	return await mg.messages.create(process.env.MAILGUN_DOMAIN, mail);
};
