import request from '@/utils/request.js'
// 将所有的针对role的请求，都封装到一个对象中
const roleApi = {
    list() {
        return request.get('/role/list')
    },
    edit(id) {
        return request.post(`/role/edit/${id}`)
    },
    updateMid(id , authVO) {
        return request.put(`/role/edit/${id}` , authVO)
    }
}

export default roleApi