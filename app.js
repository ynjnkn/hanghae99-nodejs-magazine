// [Libraries]
const express = require("express");
const mongoose = require("mongoose");

// [Models]


// [DB]
mongoose.connect("mongodb://localhost/shopping-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


const app = express();
const router = express.Router();
const port = 8080;

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));



app.listen(port, () => {
    console.log(`서버 실행 @ ${port} 포트`);
});