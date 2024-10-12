import request from '@/utils/request.js'


export const teamApi={
    selectAll(){
        return request.get("/team/selectAll")
    },
    list() {
        return request.get('/team/list')
    },
    deleteById(id) {
        return request.delete( `/team/deleteById/${id}`)
    },
    deleteAll(ids) {
        return request.delete( `/team/deleteAll/${ids}`)
    },
    add(team) {
        return request.post('/team/add', team)
    },
    selectById(id) {
        return request.get(`/team/selectById/${id}`)
    },
    detail(id){
        return request.get(`/team/detail/${id}`)
    }

}