import request from '@/utils/request.js'
// 将所有的针对user的请求，都封装到一个对象中
const userApi = {
    list(conditions) {
        return request.get('/user/list', {params: conditions})
    },
    deleteById(id) {
        return request.delete( `/user/deleteById/${id}`)
    },
    deleteAll(ids) {
        return request.delete( `/user/deleteAll/${ids}`)
    },
    add(user) {
        return request.post('/user/add', user)
    },
    selectById(id) {
        return request.get(`/user/selectById/${id}`)
    },
    update(user) {
        return request.put('/user/edit', user)
    },
    login(user){
        return request.post('/user/login', user)
    },
    userInform() {
        return request.get(`/user/userInform`)
    },
    updateStatus(id , status){
        return request.put(`/user/updateStatus/${id}/${status}`)
    },
    resetPassword(userPassword){
        return request.put(`/user/resetPassword` , userPassword)
    },
    userAllInfo(){
        return request.get('/user/allInfo')
    }
}

export default userApi