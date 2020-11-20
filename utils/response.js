
// 成功返回
function success(result,message){
    return {
        code:1200,
        message,
        result,
        success:true
    }
}

// 异常处理
function fail(result,message='系统发生异常，请稍后重试'){
    return {
        code:500,
        message,
        result,
        success:false
    }
}

// 身份过期
function exceedTime(message='',result=''){
    return {
        code:401,
        message,
        result,
        success:false
    }
}

module.exports = {
    success,
    fail,
    exceedTime
}