const state = {
  userInfo: null,
  isLogin: false,
  token: ''
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    state.isLogin = !!userInfo
    if (userInfo) {
      uni.setStorageSync('userInfo', userInfo)
    } else {
      uni.removeStorageSync('userInfo')
    }
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      uni.setStorageSync('token', token)
    } else {
      uni.removeStorageSync('token')
    }
  },
  LOGOUT(state) {
    state.userInfo = null
    state.isLogin = false
    state.token = ''
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('token')
  }
}

const actions = {
  login({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  logout({ commit }) {
    commit('LOGOUT')
  },
  initUser({ commit }) {
    const userInfo = uni.getStorageSync('userInfo')
    const token = uni.getStorageSync('token')
    if (userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
    if (token) {
      commit('SET_TOKEN', token)
    }
  }
}

const getters = {
  userInfo: state => state.userInfo,
  isLogin: state => state.isLogin,
  token: state => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}