import Vue from 'vue'
import Router from 'vue-router'
import Wrapper from '@/views/_wrapper'
import Snapjay from '@/views/Snapjay'
import Skills from '@/views/Skills'
import Credit from '@/views/Credits'
import Play from '@/views/Play'
import Contact from '@/views/Contact'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Wrapper,
      children: [
        {
          path: '/',
          name: 'snapjay',
          component: Snapjay
        },
        {
          path: '/skills',
          name: 'skills',
          component: Skills
        },
        {
          path: '/credit',
          name: 'credit',
          component: Credit
        },
        {
          path: '/play',
          name: 'play',
          component: Play
        },
        {
          path: '/contact',
          name: 'contact',
          component: Contact
        }
      ]
    }
  ]
})
