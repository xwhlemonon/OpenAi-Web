import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {path: '/', name: 'home', component: HomeView},
    {path: '/pic', component: () => import("../views/PicView.vue")},
    {path: '/cloudreve', component: () => import("../views/CloudreveView.vue")}
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), routes
})

export default router
