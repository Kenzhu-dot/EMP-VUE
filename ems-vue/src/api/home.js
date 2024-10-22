import request from '@/utils/request.js'
// 将所有的针对user的请求，都封装到一个对象中
const homeApi = {
    list(MessageStatus) {
        return request.get(`/home/getMessageList/${MessageStatus.value}`)
    },
    sendMessage(data) {
        return request.post(`/home/sendMessage`, data)
    },
    changeStatus(data){
        return request.put(`/home/changeStatus/${data}`)
    }
}

export default homeApi