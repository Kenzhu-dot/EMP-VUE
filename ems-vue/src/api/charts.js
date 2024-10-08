import request from '@/utils/request.js'

export const chartsApi={
    projectCompletion(){
        return request('/charts/projectCompletion')
    },
    projectMonNum(){
        return request('/charts/projectMonNum')
    },
    projectMonNumEnd(){
        return request('/charts/projectMonNumEnd')
    }
}