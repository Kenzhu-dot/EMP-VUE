import request from '@/utils/request.js'
// 将所有的针对user的请求，都封装到一个对象中
const captchaApi = {
    loadCaptcha() {
        return request.get('/captcha')
    }
}

export default captchaApi