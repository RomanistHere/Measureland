const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const Sentry = require('@sentry/node');

const Geo = require('../models/geo.model');
const User = require('../models/user.model');
const UserVerification = require('../models/token.model');
const PasswordReset = require('../models/password-reset.model');

const { sendEmail } = require('../helpers/email');

exports.user_register = async (req, res) => {
    const { email, lang } = req.body;
    const isEmailExist = await User.findOne({ email: email });

    if (isEmailExist)
        return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const token = v4().toString().replace(/-/g, '')
    const domain = process.env.SITE_URL || 'http://localhost:8080'
    const verificationUrl = lang === 'en'
        ? `${domain}?token=${token}`
        : `${domain}/${lang}/?token=${token}`

    const user = new User({
        email,
        password,
        properties: {
            lang
        }
    });

    try {
        await sendEmail({
            email,
            lang,
            verificationUrl,
            reason: 'Verify'
        })

        const savedUser = await user.save();

        await UserVerification.updateOne({
            user: savedUser._id
        }, {
            user: savedUser._id,
            token: token
        }, {
            upsert: true
        })

        return res.json({
            error: null,
            data: {
                message: "Register successful",
                userID: email
            },
        });
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

const dateDiffInDays = (date1, date2) => {
    const msPerDay = 1000 * 60 * 60 * 24
    const a = new Date(date1)
    const b = new Date(date2)
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor(Math.abs(utc2 - utc1) / msPerDay)
}

const isRatingActive = (user) => {
    if (user.usergroup === 0)
        return { canUserAdd: true, activeRatings: 3 }

    if (user.properties.activeRatings > 0)
        return { canUserAdd: true, activeRatings: user.properties.activeRatings - 1 }

    const dayDifference = dateDiffInDays(Date.now(), user.properties.lastRated)

    if (dayDifference > 5 && dayDifference <= 10)
        return { canUserAdd: true, activeRatings: 0 }
    else if (dayDifference > 10 && dayDifference <= 15)
        return { canUserAdd: true, activeRatings: 1 }
    else if (dayDifference > 15)
        return { canUserAdd: true, activeRatings: 2 }

    return { canUserAdd: false, activeRatings: null }
}

exports.user_login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }, '-properties.ratedLocations -properties.ratings');

        if (!user)
            return res.status(400).json({ error: "Email is wrong" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword)
            return res.status(400).json({ error: "Password is wrong" });

        if (!user.verified)
            return res.status(400).json({ error: "User is not verified" });

        req.session.userID = user.email
        req.session.userName = user.username
        req.session.lang = user.properties.lang
        req.session.dateCreated = user.dateCreated

        const { activeRatings } = isRatingActive(user)

        return res.json({
            error: null,
            data: {
                message: "Login successful",
                userID: user.email,
                dateCreated: user.dateCreated,
                activeRatings: user.usergroup === 0 ? 999 : activeRatings,
                userName: user.username
            },
        });
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

exports.user_onboard = async (req, res) => {
    const { userName, ageGrp, moneyGrp, userID } = req.body
    try {
        const update = await User.updateOne(
            { 'email': userID },
            {
                $set: {
                    'username': userName,
                    'properties.ageGrp': ageGrp,
                    'properties.moneyGrp': moneyGrp,
                    'properties.activeRatings': ageGrp === 2 || ageGrp === 3 ? 4 : 3,
                }
            }
        )

        if (update.nModified == 0)
            return res.status(400).json({ error: 'User does not exists' });

        return res.json({
            error: null,
            data: {
                message: "Onboarding successful",
                userID
            },
        });
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

exports.user_verify = async (req, res) => {
    const urlParams = new URLSearchParams(req.params.token)
    const { token } = Object.fromEntries(urlParams)
    const userVerification = await UserVerification.findOne({ token: token })

    if (userVerification) {
        const user = await User.findOneAndUpdate({ _id: userVerification.user }, { verified: true })

        await UserVerification.deleteOne({
            token: token
        })

        if (!user)
            return res.status(400).json({ error: "Email is wrong" });

        req.session.userID = user.email
        req.session.userName = user.username
        req.session.lang = user.properties.lang
        req.session.dateCreated = user.dateCreated

        await sendEmail({
            email: user.email,
            lang: user.properties.lang,
            reason: 'Verified'
        })

        return res.json({
            error: null,
            data: {
                message: "Verification is successful",
                userID: user.email
            },
        });
    } else {
        return res.status(400).json({ error: "Verification link is invalid or has expired" });
    }
};

exports.user_reverify = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ error: "Email is wrong" });
        } else if (user.verified) {
            return res.status(400).json({ error: "Already verified" });
        } else {
            const token = v4().toString().replace(/-/g, '')
            const domain = process.env.SITE_URL || 'http://localhost:8080'
            const { lang } = user.properties
            const verificationUrl = lang === 'en'
                ? `${domain}?token=${token}`
                : `${domain}/${lang}/?token=${token}`

            await UserVerification.updateOne({
                user: user._id
            }, {
                user: user._id,
                token: token
            }, {
                upsert: true
            })

            await sendEmail({
                email: req.body.email,
                lang,
                verificationUrl,
                reason: 'Verify'
            })

            return res.json({
                error: null,
                data: {
                    message: "Verification email sent",
                    userID: req.body.email
                },
            });
        }
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

exports.user_check = async (req, res) => {
    const { userID, userName, lang, dateCreated } = req.session
    return res.json({
        error: null,
        data: {
            message: "Check user",
            userID: userID ? userID : null,
            userName: userName ? userName : null,
            lang: lang ? lang : null,
            dateCreated: dateCreated ? dateCreated : null,
        },
    });
};

exports.user_places = async (req, res) => {
    const { userID } = req.session

    const user = await User.findOne({ email: userID }, 'properties.ratedLocations');

    if (!user)
        return res.status(400).json({ error: "Couldn't find the user" });

    const geo = await Geo.find(
        {
            _id: {
                $in: user.properties.ratedLocations
            }
        },
        'location.coordinates -_id'
    )

    return res.json({
        error: null,
        data: {
            message: "Rated places",
            places: geo
        },
    });
};

exports.user_logout = async (req, res, next) => {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(400).json({ error: "Logout unsuccessful" });
            } else {
                return res.json({
                    error: null,
                    data: {
                        message: "Logout is successful"
                    },
                });
            }
        });
    } else {
        return res.status(400).json({ error: "Couldn't find a profile" });
    }
};

exports.user_reset_password = async (req, res, next) => {
    try {
        const userEmail = req.body.email
        const user = await User.findOne({ email: userEmail });

        if (!user)
            return res.status(400).json({ error: "Email is wrong" });

        const token = v4().toString().replace(/-/g, '')
        const domain = process.env.SITE_URL || 'http://localhost:8080'
        const { lang } = user.properties
        const verificationUrl = lang === 'en'
            ? `${domain}?reset_pass_token=${token}`
            : `${domain}/${lang}/?reset_pass_token=${token}`

        await PasswordReset.updateOne({
            user: user._id
        }, {
            user: user._id,
            token: token
        }, {
            upsert: true
        })

        await sendEmail({
            email: userEmail,
            lang,
            verificationUrl,
            reason: 'Reset'
        })

        return res.json({
            error: null,
            data: {
                message: "Email sent",
                userID: userEmail
            },
        });
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

exports.user_change_password = async (req, res) => {
    const { password, token } = req.body
    if (!token || token.length < 10)
        return res.status(400).json({ error: 'Password link is invalid or expired' });

    try {
        const passwordReset = await PasswordReset.findOne({ token: token });
        if (!passwordReset)
            return res.status(400).json({ error: 'Password link is invalid or expired' });

        const user = await User.findOne({ _id: passwordReset.user });
        if (!user)
            return res.status(400).json({ error: "User does not exists" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword)
            return res.status(400).json({ error: "Matches old password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const update = await User.updateOne(
            { _id: passwordReset.user },
            {
                $set: {
                    'password': hashedPassword
                }
            }
        )

        if (update.nModified == 0)
            return res.status(400).json({ error: 'Nothing was modified' });

        await PasswordReset.deleteOne({ _id: passwordReset._id })

        return res.json({
            error: null,
            data: {
                message: "Password changed",
                userID: user.email
            },
        });
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

exports.user_language = async (req, res) => {
    if (!req.session.userID) {
        return res.status(400).json({ error: "User is not logged in" })
    }

    const { lang } = req.body
    try {
        const update = await User.updateOne(
            { 'email': req.session.userID },
            {
                $set: {
                    'properties.lang': lang
                }
            }
        )

        if (update.nModified == 0)
            return res.status(400).json({ error: 'Language settings are not updated' });

        req.session.lang = lang

        return res.json({
            error: null,
            data: {
                message: "Language settings updated",
                userID: req.session.userID
            },
        });
    } catch (error) {
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};
