// import firebase from 'firebase'
import axios from 'axios'

const zomatoUrl = 'https://developers.zomato.com/api/v2.1'
const axiosConfig = { headers: { 'user-key': process.env.VUE_APP_ZOMATO_KEY } }

const state = {
  cityId: null,
  resultsIndex: 0,
  currentRestaurant: null,
  nextRestaurants: []
}

const getters = {
  currentRestaurant: state => state.currentRestaurant,
  city_id: state => state.cityId,
  resultsIndex: state => state.resultsIndex

}

const actions = {
  get_city ({ commit }, query) {
    return axios.get(`${zomatoUrl}/cities?q=${query}`, axiosConfig).then(response => {
      const cities = response.data.location_suggestions
      if (cities.length) {
        commit('set_city_id', cities[0].id)
      }
    })
  },
  async get_next_restaurants ({ commit, dispatch, getters, rootGetters }) {
    if (!rootGetters.collections.listFetched('seen')) {
      await dispatch('collections/get_list', { listType: 'seen' }, { root: true })
    }
    const searchUrl = `search?entity_id=${getters.city_id}&entity_type=city&start=${ getters.resultsIndex }`
    return axios.get(searchUrl, axiosConfig).then(response => {
      commit('set_results_index', response.data.results_shown)
      const restaurantsToQueue = response.data.restaurants.filter(restaurant => {
        rootGetters.collections.ids('seen').some(seenId => seenId === restaurant.id)
      })
      if (restaurantsToQueue.length) {
        commit('set_next_restaurants', restaurantsToQueue)
        commit('set_current_restaurant', [0])
      } else {
        dispatch('get_next_restaurants')
      }
    })
  }
}

const mutations = {
  set_city_id (state, id) {
    state.cityId = id
  },
  set_results_index (state, increment) {
    state.resultsIndex += increment
  },
  set_next_restaurants (state, restaurants) {
    state.nextRestaurants = restaurants
  },
  set_current_restaurant (state, restaurant) {
    state.currentRestaurant = restaurant
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
