import Vue from 'vue'
import Router from 'vue-router'
import Wrapper from '@/views/_wrapper'
import Snapjay from '@/views/Snapjay'
import Skills from '@/views/Skills'
import Credit from '@/views/Credits'
import Play from '@/views/Play'
import Contact from '@/views/Contact'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: Wrapper,
      children: [
        {
          path: '/',
          name: 'snapjay',
          component: Snapjay,
          meta: {
            title: 'snapjay'
          }
        },
        {
          path: '/skills',
          name: 'skills',
          component: Skills,
          meta: {
            title: 'Skills'
          }
        },
        {
          path: '/credit',
          name: 'credit',
          component: Credit,
          meta: {
            title: 'Credit'
          }
        },
        {
          path: '/play',
          name: 'play',
          component: Play,
          meta: {
            title: 'Play'
          }
        },
        {
          path: '/contact',
          name: 'contact',
          component: Contact,
          meta: {
            title: 'Contact'
          }
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  document.getElementsByTagName('body')[0].className = to.name
  document.getElementsByTagName('title')[0].text = `${to.meta.title}  - An experienced front end web developer.`
  next()
})

export default router
