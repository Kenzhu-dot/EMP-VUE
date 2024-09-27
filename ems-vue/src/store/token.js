import {defineStore} from 'pinia'
import {ref} from "vue";
import Cookies from "js-cookie";
const remember =ref(false)
const cookiesStorage= {
    setItem (key, state) {
        state=JSON.parse(state)
        if(remember.value){
            return Cookies.set(key, state.token, { expires: 7 })
        }else {
            return Cookies.set(key, state.token)
        }
    },
    getItem (key) {
        return JSON.stringify({
            token: Cookies.get('token'),
        })
    },
}
export const useTokenStore=defineStore('token',{
    state(){
        return {
            token:""
        }
    },
    actions:{
        setToken(newToken , autoLogin) {
            this.token = newToken
            remember.value=autoLogin
        },
        removeToken() {
            this.token = ''
        }
    },
    persist: {
        enabled: true, // 开启缓存  默认会存储在本地localstorage
        storage:cookiesStorage
    }
})