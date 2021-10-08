const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');
const Sentry = require('@sentry/node');

const Geo = require('../models/geo.model');
const User = require('../models/user.model');
const UserVerification = require('../models/token.model');
const PasswordReset = require('../models/password-reset.model');

const { sendEmail } = require('../helpers/email');
const isProd = process.env.IS_PROD === '1';

exports.user_register = async (req, res) => {
    const { email, lang } = req.body;
    const isEmailExist = await User.findOne({ email: email });

    if (isEmailExist)
        return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const token = v4().toString().replace(/-/g, '')
    const domain = isProd ? process.env.SITE_URL : process.env.SITE_URL_DEV
    const verificationUrl = lang === 'en'
        ? `${domain}?token=${token}`
        : `${domain}/${lang}/?token=${token}`

    const user = new User({
        email,
        password,
        dateCreated: new Date(),
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
        console.log(error)
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
};

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

        req.session.userID = user.email;

        return res.json({
            error: null,
            data: {
                message: "Login successful",
                userID: user.email,
                dateCreated: user.dateCreated,
                activeRatings: user.usergroup === 0 ? 99 : user.properties.activeRatings,
                wantMoreRatings: user.properties.wantMoreRatings,
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
            const domain = isProd ? process.env.SITE_URL : process.env.SITE_URL_DEV
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

const updateActiveRatings = user => {
    if (!user)
        return { shouldUpdate: false };

    const { lastRatingsAdded, activeRatings } = user.properties;
    const timeUpdated = new Date(lastRatingsAdded).getTime();
    const timeDifference = Math.abs(Date.now() - timeUpdated);
    const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (differenceInDays >= 5 && activeRatings < 3)
        return { shouldUpdate: true, activeRatings: 3 };

    return { shouldUpdate: false, activeRatings };
}

exports.user_check = async (req, res) => {
    const { userID } = req.session

    try {
        const user = await User.findOne({ email: userID }, '-properties.ratedLocations -properties.ratings');

        const { shouldUpdate, activeRatings } = updateActiveRatings(user);

        if (shouldUpdate) {
            const update = await User.updateOne(
                { email: userID },
                {
                    $set: {
                        'properties.lastRatingsAdded': Date.now(),
                        'properties.wantMoreRatings': false,
                        'properties.activeRatings': activeRatings,
                    }
                }
            )

            if (update.nModified == 0) {
                console.log("Automatic active rating update didn't work (user_check)")
                Sentry.captureException("Automatic active rating update didn't work (user_check)");
            }
        }

        return res.json({
            error: null,
            data: {
                message: "Check user",
                userID: user ? user.email : null,
                userName: user ? user.username : null,
                lang: user ? user.properties.lang : null,
                dateCreated: user ? user.dateCreated : null,
                wantMoreRatings: user ? (shouldUpdate ? false : user.properties.wantMoreRatings) : null,
                activeRatings: user ? (user.usergroup === 0 ? 99 : activeRatings) : null,
            },
        });
    } catch (error) {
        console.log(error)
        Sentry.captureException(error);
        return res.status(400).json({ error });
    }
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

exports.ask_more_ratings = async (req, res) => {
    const { userID } = req.session

    const user = await User.findOneAndUpdate({ email: userID }, { 'properties.wantMoreRatings': true })

    if (!user)
        return res.status(400).json({ error: "Couldn't find the user" });

    return res.json({
        error: null,
        data: {
            message: "Asked for ratings",
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
        const domain = isProd ? process.env.SITE_URL : process.env.SITE_URL_DEV
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
