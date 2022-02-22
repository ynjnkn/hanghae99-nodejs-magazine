// [Libraries]
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");


// [Models]
const User = require("./models/user");
const Post = require("./models/post");


// [Middlewares]
const authMiddleware = require("./middlewares/auth-middleware");


// [Functions]
const { nicknameRegExCheck, passwordRegExCheck } = require("./regEx");


// [DB]
// mongoose.connect("mongodb://localhost/hanghae99-nodejs-magazine", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
mongoose.connect("mongodb://3.39.25.252/hanghae99-nodejs-magazine", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


const app = express();
const router = express.Router();
const port = 3000;

app.use(cors());
app.use("/api", bodyParser.json(), router);
// app.use(express.static("assets"));

router.get("/", (req, res) => {
    res.send();
});


// [API] 회원가입
router.post("/users/signup", async (req, res) => {
    const { userId, nickname, password, passwordCheck } = req.body;

    const existingUser = await User.findOne({
        $or: [{ userId }, { nickname }],
    }).exec();

    // 비밀번호와 비밀번호 확인 일치 여부 확인
    if (password != passwordCheck) {
        return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." });
    }
    // 닉네임 정규표현식 부합 여부 확인
    else if (!nicknameRegExCheck(nickname)) {
        return res
            .status(400)
            .json({ message: "올바르지 않은 닉네임 형식입니다." });
    }
    // 비밀번호 정규표현식 부합 여부 확인
    else if (!passwordRegExCheck(password)) {
        return res
            .status(400)
            .json({ message: "올바르지 않은 비밀번호 형식입니다." });
    }
    // 비밀번호가 닉네임을 포함하는지 여부 확인
    else if (password.includes(nickname)) {
        return res
            .status(400)
            .json({ message: "비밀번호가 닉네임을 포함할 수 없습니다." });
    }
    // 사용 중인 닉네임 또는 이메일이 있는지 여부 확인
    else if (existingUser) {
        return res
            .status(400)
            .json({ message: "이미 사용 중인 아이디 또는 닉네임 입니다." });
    }
    // 회원가입 실행
    else {
        const newUser = new User({
            userId, nickname, password,
        });
        await newUser.save();

        console.log("회원가입 성공");
        return res
            .status(200)
            .json({ message: "회원가입 성공" });
    };
});


// [API] 로그인
router.post("/users/signin", async (req, res) => {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId, password }).exec();

    if (!user || password != user.password) {
        return res
            .status(400)
            .json({ message: "잘못된 아이디 또는 비밀번호 입니다." });
    }

    const token = jwt.sign(
        { userId: user.userId },
        "whitenoise",
        { expiresIn: 1 * 1000 * 60 * 60 });

    console.log("로그인 성공");
    res
        .status(200)
        .json({
            message: "로그인 성공",
            token,
        });
});


// [API] 사용자 인증
router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;

    if (!user) {
        return res
            .status(401)
            .json({ message: "사용자 인증 실패" });
    }
    return res
        .status(200)
        .json({
            message: "사용자 인증 성공",
            user: {
                userId: user.userId,
                nickname: user.nickname,
            },
        });
});


// [API] 중복 로그인, 회원가입 페이지 접근 방지
// router.get("/users/me", authMiddleware, async (req, res) => {
//     const { user } = res.locals;
//     if (user) {
//         return res
//             .json({
//                 message: "이미 로그인이 되어있습니다.",
//             })
//     }
// });


// [API] 게시글 목록 조회
router.get("/posts", async (req, res) => {
    const posts = await Post.find().sort("-createdAt").exec();

    res
        .status(200)
        .json({
            posts,
            message: "게시물 목록 조회 성공",
        })
})


// [API] 게시글 추가
router.post("/posts", authMiddleware, async (req, res) => {
    const writer = res.locals.user.userId;
    const { images, desc } = req.body;

    const newPost = new Post({
        writer, images, desc,
    })
    await newPost.save();

    res
        .status(200)
        .json({ message: "게시글 추가 성공" });
})


app.listen(port, () => {
    console.log(`서버 실행 @ ${port} 포트`);
});