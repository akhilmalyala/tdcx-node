const database = require("./database");
const jwt = require('jsonwebtoken');

module.exports = {
    getPool : function () {
        return database.getMysqlPool();
    },
    stripTags: function (s,t = true) {
        if(s === undefined){
            s = "";
        }
        s = s+"";
        s = require('striptags')(s);
        if(t){
            s = require("trim")(s);
        }
        return s;
    },
    generateAccessToken(userId) {
        return jwt.sign(userId, process.env.TOKEN_SECRET);
    },
    getCurrentDate : function() {

        let d = new Date(new Date().getTime() + ( 5.5 * 60 * 60 * 1000 )),
            year = d.getUTCFullYear().toString(),
            month = prependZero((d.getUTCMonth() + 1)+""),
            day = prependZero(d.getUTCDate()+""),
            hours = prependZero(d.getUTCHours().toString()+""),
            minutes = prependZero(d.getUTCMinutes().toString()+""),
            seconds = prependZero(d.getUTCSeconds().toString()+"");

            return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }
};

function prependZero(string) {
    if (string.length < 2) {
        return "0" + string;
    }

    return string;
}