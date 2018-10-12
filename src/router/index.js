import Vue from 'vue'
import Router from 'vue-router'
import Wrapper from '@/views/_wrapper'
import Snapjay from '@/views/Snapjay'
import Skills from '@/views/Skills'
import Credits from '@/views/Credits'
import CreditsBackground from '@/views/CreditsBackground'
import Play from '@/views/Play'
import PlayBackground from '@/views/PlayBackground'
import Contact from '@/views/Contact'
import ContactBackground from '@/views/ContactBackground'

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
          path: '/credits',
          name: 'credits',
          components: {
            default: Credits,
            background: CreditsBackground
          },
          meta: {
            title: 'Credits'
          }
        },
        {
          path: '/play/:active',
          name: 'play',
          props: {default: true},
          components: {
            default: Play,
            background: PlayBackground
          },
          meta: {
            title: 'Play'
          }
        },
        {
          path: '/contact',
          name: 'contact',
          components: {
            default: Contact,
            background: ContactBackground
          },
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
