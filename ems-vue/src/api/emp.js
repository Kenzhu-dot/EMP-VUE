import request from '@/utils/request.js'

export const empApi={
    list(conditions) {
        return request.get('/emp/list', {params: conditions})
    },
    deleteById(id) {
        return request.delete( `/emp/deleteById/${id}`)
    },
    deleteAll(ids) {
        return request.delete( `/emp/deleteAll/${ids}`)
    },
    add(emp) {
        return request.post('/emp/add', emp)
    },
    selectById(id) {
        return request.get(`/emp/selectById/${id}`)
    },
    update(emp) {
        return request.put('/emp/edit', emp)
    }

}