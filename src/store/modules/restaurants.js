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
  cityId: state => state.cityId,
  resultsIndex: state => state.resultsIndex,
  nextRestaurants: state => state.nextRestaurants
}

const actions = {
  get_city ({ commit, dispatch }, query) {
    return axios.get(`${zomatoUrl}/cities?q=${query}`, axiosConfig).then(response => {
      const cities = response.data.location_suggestions
      if (cities.length) {
        commit('set_city_id', cities[0].id)
        return dispatch('get_next_restaurants')
      }
      return response
    })
  },
  async get_next_restaurants ({ commit, dispatch, getters, rootGetters }) {
    if (!rootGetters['collections/listFetched']('seen')) {
      await dispatch('collections/get_list', { listType: 'seen' }, { root: true })
    }
    const searchUrl = `${zomatoUrl}/search?entity_id=${getters.cityId}&entity_type=city&start=${getters.resultsIndex}`
    return axios.get(searchUrl, axiosConfig).then(response => {
      commit('set_results_index', response.data.results_shown)
      let restaurantsToQueue = null
      if (response.data.results_shown) {
        restaurantsToQueue = response.data.restaurants.map(restaurant => restaurant.restaurant)
        if (rootGetters['collections/total']('seen')) {
          restaurantsToQueue = restaurantsToQueue.filter(restaurant => {
            rootGetters['collections/ids']('seen').some(seenId => seenId === restaurant.id)
          })
        }
      }
      if (restaurantsToQueue) {
        if (restaurantsToQueue.length) {
          if (!getters.currentRestaurant) {
            commit('set_next_restaurants', restaurantsToQueue.slice(1))
            commit('set_current_restaurant', restaurantsToQueue[0])
          } else {
            commit('set_next_restaurants', restaurantsToQueue)
          }
          return response
        } else {
          return dispatch('get_next_restaurants')
        }
      }
    })
  },
  swipe_restaurant ({ commit, dispatch, getters, rootGetters }, didLikeRestaurant) {
    const listType = didLikeRestaurant ? 'liked' : 'disliked'
    const restaurant = getters.currentRestaurant
    return dispatch('collections/add_to_list', { listType, restaurant }, { root: true }).then(()=> {
      commit('set_current_restaurant', getters.nextRestaurants[0])
      if (getters.nextRestaurants.length === 1) {
        return dispatch('get_next_restaurants')
      } else {
        return commit('remove_current_restaurant')
      }
    }).catch(err => {
      return err
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
    console.log('incoming restaurant: ', restaurant.name)
    state.currentRestaurant = restaurant
    console.log('currentRestuarant: ', state.currentRestaurant.name)
  },
  remove_current_restaurant (state) {
    state.nextRestaurants.splice(0, 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
