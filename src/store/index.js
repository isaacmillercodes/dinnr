import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import collections from './modules/collections'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    auth,
    collections
  }
})
