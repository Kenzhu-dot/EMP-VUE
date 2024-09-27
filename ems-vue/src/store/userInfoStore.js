import {defineStore} from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
    //存储数据地方
    state() {
        return {
            user: {}
        }
    },
    //actions里面放的是一个一个方法
    actions: {
        setUserInfo(user) {
            this.user = user
        },
        removeUserInfo(value) {
            this.user = {}
        }
    },
    persist: {
        enabled: true, // 开启缓存  默认会存储在本地localstorage
    }
})