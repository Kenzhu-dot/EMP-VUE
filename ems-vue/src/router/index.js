// 创建一个路由器，并暴露出去
// 第一步：引入createRouter
import {createRouter ,createWebHistory} from "vue-router";
// 引入一个一个可能要呈现组件
import Layout from '@/views/Layout.vue'
import Login from '@/views/Login.vue'
import Emp from '@/views/Emp.vue'
import Role from '@/views/Role.vue'
import Project from '@/views/Project.vue'
import Auth from "@/views/Auth.vue";
import Charts from "@/views/Charts.vue";
import Team from "@//views/Team.vue"
import Message from "@/views/Message.vue"

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/login', component: Login},
        {
            path: '/', component: Layout, children: [
                {path: '/emp', component: Emp},
                {path: '/role', component: Role},
                {path:'/project' , component:Project},
                {path:'/auth', component:Auth},
                {path:'/charts', component:Charts},
                {path:'team' , component:Team},
                {path:'/home/message' , component:Message},
            ]
        }
    ]
})

// 暴露出去router
export default router