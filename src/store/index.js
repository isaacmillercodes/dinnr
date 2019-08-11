import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import auth from './modules/auth'
import collections from './modules/collections'
import restaurants from './modules/restaurants'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
    homeComponent: 'Auth'
  },
  getters: {
    homeComponent: state => state.homeComponent
  },
  actions: {
    go_to_route({ commit }, routeObject) {
      router.push(routeObject)
    },
    change_home_component({ commit }, newComponent) {
      commit('set_home_component', newComponent)
    }
  },
  mutations: {
    set_home_component(state, newComponent) {
      state.homeComponent = newComponent
    }
  },
  modules: {
    auth,
    collections,
    restaurants
  }
})
