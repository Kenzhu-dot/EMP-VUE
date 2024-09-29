import request from '@/utils/request.js'


export const teamApi={
    selectAll(){
        return request.get("/team/selectAll")
    }
}