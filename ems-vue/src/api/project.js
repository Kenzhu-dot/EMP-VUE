import request from '@/utils/request.js'


export const projectApi = {
    list(condition){
        return request.get("/project/list", {params :condition})
    },
    exportExcel(){
       return request({
           url: '/project/exportExcel',
           method : "GET",
           responseType : 'blob'
       })
    },
    deleteById(id) {
        return request.delete( `/project/deleteById/${id}`)
    },
    deleteAll(ids) {
        return request.delete( `/project/deleteAll/${ids}`)
    },
    add(project) {
        return request.post('/project/add', project)
    },
    selectById(id) {
        return request.get(`/project/selectById/${id}`)
    },
    update(project) {
        return request.put('/project/edit', project)
    }
}