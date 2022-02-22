module.exports = {
    // (1) 최소 3자 이상
    // (2) 알파벳 대소문자(a~z, A~Z), 숫자(0~9)만 가능
    nicknameRegExCheck: function (nickname) {
        const nicknameRegEx = new RegExp(/^[a-zA-Z0-9]{3,}$/);
        if (nicknameRegEx.test(nickname)) {
            return true;
        }
        else {
            return false;
        }
    },
    // (1) 최소 4자 이상
    // (2) 숫자, 영문, 특수문자 각 1자리 이상
    passwordRegExCheck: function (password) {
        const passwordRegEx = new RegExp(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{4,}$/);
        if (passwordRegEx.test(password)) {
            return true;
        }
        else {
            return false;
        }
    }
}
