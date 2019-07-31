import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true, title: 'Home'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/create_account',
      name: 'create_account',
      component: () => import(/* webpackChunkName: "create_account" */ './views/CreateAccount.vue'),
      meta: {
        title: 'Criar conta'
      }
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: () => import(/* webpackChunkName: "deposit" */ './views/Deposit.vue'),
      meta: {
        requiresAuth: true, title: 'Depositar'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Sarakin`
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else next()
})

export default router
