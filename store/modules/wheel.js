import { getUserWheels, saveUserWheels } from '@/utils/storage.js'
import { defaultWheel, presetWheels } from '@/utils/wheel.js'

const state = {
  currentWheel: null,
  userWheels: []
}

const mutations = {
  SET_CURRENT_WHEEL(state, wheel) {
    state.currentWheel = wheel
  },
  SET_USER_WHEELS(state, wheels) {
    state.userWheels = wheels
  },
  ADD_USER_WHEEL(state, wheel) {
    state.userWheels.push(wheel)
  },
  UPDATE_USER_WHEEL(state, { wheelId, updatedWheel }) {
    const index = state.userWheels.findIndex(w => w.id === wheelId)
    if (index !== -1) {
      state.userWheels[index] = updatedWheel
    }
  },
  DELETE_USER_WHEEL(state, wheelId) {
    state.userWheels = state.userWheels.filter(w => w.id !== wheelId)
  }
}

const actions = {
  loadUserWheels({ commit }) {
    const wheels = getUserWheels()
    commit('SET_USER_WHEELS', wheels)
  },
  addUserWheel({ commit, dispatch }, wheel) {
    commit('ADD_USER_WHEEL', wheel)
    dispatch('saveUserWheels')
  },
  updateUserWheel({ commit, dispatch }, { wheelId, updatedWheel }) {
    commit('UPDATE_USER_WHEEL', { wheelId, updatedWheel })
    dispatch('saveUserWheels')
  },
  deleteUserWheel({ commit, dispatch }, wheelId) {
    commit('DELETE_USER_WHEEL', wheelId)
    dispatch('saveUserWheels')
  },
  saveUserWheels({ state }) {
    saveUserWheels(state.userWheels)
  },
  setCurrentWheel({ commit }, wheel) {
    commit('SET_CURRENT_WHEEL', wheel)
  }
}

const getters = {
  currentWheel: state => state.currentWheel,
  userWheels: state => state.userWheels,
  allWheels: state => {
    return [defaultWheel, ...presetWheels, ...state.userWheels]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}