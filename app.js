// [Libraries]
const express = require("express");
const mongoose = require("mongoose");


// [Models]


// [Functions]
const { nicknameRegExCheck, passwordRegExCheck } = require("./regEx");


// [DB]
mongoose.connect("mongodb://localhost/hanghae99-nodejs-magazine", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


const app = express();
const router = express.Router();
const port = 3000;

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

router.get("/", (req, res) => {
    res.send();
});

// [API] 회원가입
router.post("/users/signup", async (req, res) => {
    const { userId, nickname, password, passwordCheck } = req.body;
    console.log("req.body", req.body);

    // 비밀번호와 비밀번호 확인 일치 여부
    if (password != passwordCheck) {
        return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 닉네임 정규표현식 부합 여부
    else if (!nicknameRegExCheck(nickname)) {
        return res
            .status(400)
            .json({ message: "올바르지 않은 닉네임 형식입니다." });
    }

    // 비밀번호 정규표현식 부합 여부
    else if (!passwordRegExCheck(password)) {
        return res
            .status(400)
            .json({ message: "올바르지 않은 비밀번호 형식입니다." });
    }

    // 비밀번호가 닉네임을 포함하는지 여부
    else if (password.includes(nickname)) {
        return res
            .status(400)
            .json({ message: "비밀번호가 닉네임을 포함할 수 없습니다." });
    }

    // 모든 조건을 통과한 경우
    else {
        
        return res
            .status(200)
            .json({ message: "회원가입 API 실행" });
    }


});


app.listen(port, () => {
    console.log(`서버 실행 @ ${port} 포트`);
});