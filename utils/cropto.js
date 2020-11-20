
let cropto = require("crypto");

function jiamiMd5(num){
    // 需要加密的字符串
    let sf = cropto.createHash("md5");//使用加密算法
    sf.update(num);//进行加密
    let content = sf.digest("hex");//以二进制数据为字符串形式展示
    return content;
}

module.exports = {jiamiMd5};