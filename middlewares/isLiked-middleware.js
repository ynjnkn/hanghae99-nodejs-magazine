const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
        next();
    }
    try {
        const { userId } = jwt.verify(authToken, "whitenoise");
        User.findOne({ userId })
            .then((user) => {
                res.locals.user = user;
                next();
            });
    } catch (err) {
        res.status(401).send({
            message: "토큰 디코딩 오류",
        });
    }
}