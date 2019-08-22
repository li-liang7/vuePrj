import Vue from 'vue'
import Router from 'vue-router'
import HOME from '@/components/home/home'
import Login from '@/components/login/login'
import Users from '@/components/users/users'
import Rights from '@/components/rights/rights'
import Roles from '@/components/roles/roles'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HOME,
      children:[
        {
          path:'/users',
          name:'users',
          component:Users
        },
        {
          path:'/rights',
          name:'rights',
          component:Rights
        },
        {
          path:'/roles',
          name:'roles',
          component:Roles
        },
      
      ]
    },
    {
      //根据浏览器访问的路径跳转
      path: '/login',
      name: 'login',
      //根据导入找到相关的部件
      component: Login
    }
  ]
})
