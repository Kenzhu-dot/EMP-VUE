import request from '@/utils/request.js'
// 将所有的针对auth的请求，都封装到一个对象中
const authApi = {
    list(conditions) {
        return request.get('/auth/list', {params: conditions})
    },
    deleteById(id) {
        return request.delete( `/auth/deleteById/${id}`)
    },
    deleteAll(ids) {
        return request.delete( `/auth/deleteAll/${ids}`)
    },
    add(auth) {
        return request.post('/auth/add', auth)
    },
    selectById(id) {
        return request.get(`/auth/selectById/${id}`)
    },
    update(auth) {
        return request.put('/auth/edit', auth)
    },
    login(auth){
        return request.post('/auth/login', auth)
    },
    authInform() {
        return request.get(`/auth/authInform`)
    },
    updateStatus(id , status){
        return request.put(`/auth/updateStatus/${id}/${status}`)
    }
}

export default authApi