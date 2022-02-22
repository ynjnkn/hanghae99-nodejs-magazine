const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
        return res
            .status(401)
            .json({
                message: "로그인 후 이용 가능합니다.",
            });
    }
    try {
        const { userId } = jwt.verify(authToken, "whitenoise");
        User.findOne({ userId })
            .then((user) => {
                if (!user) {
                    return res
                        .status(401)
                        .json({
                            message: "존재하지 않는 사용자 입니다.",
                        })
                }
                res.locals.user = user;
                next();
            });
    } catch (err) {
        console.log("로그인 후 이용 가능합니다.");
        res.status(401).send({
            mssage: "로그인 후 이용 가능합니다.",
        });
    }
}