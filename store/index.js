import { createStore } from 'vuex'
import user from './modules/user'
import wheel from './modules/wheel'

const store = createStore({
  modules: {
    user,
    wheel
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store