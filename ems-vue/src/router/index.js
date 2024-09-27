// 创建一个路由器，并暴露出去
// 第一步：引入createRouter
import {createRouter ,createWebHistory} from "vue-router";
// 引入一个一个可能要呈现组件
import Layout from '@/views/Layout.vue'
import Login from '@/views/Login.vue'
import Emp from '@/views/Emp.vue'
import Role from '@/views/Role.vue'

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/login', component: Login},
        {
            path: '/', component: Layout, children: [
                {path: '/emp', component: Emp},
                {path: '/role', component: Role}
            ]
        }
    ]
})

// 暴露出去router
export default router