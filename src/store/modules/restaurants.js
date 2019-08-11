// import firebase from 'firebase'
import axios from 'axios'

const zomatoUrl = 'https://developers.zomato.com/api/v2.1'
const axiosConfig = { headers: { 'user-key': process.env.VUE_APP_ZOMATO_KEY } }

const state = {
  cityId: null,
  categories: [],
  cuisines: [],
  // resultsIndex: 0,
  restaurantList: [],
  loadingRestaurants: true
}

const getters = {
  cityId: state => state.cityId,
  categories: state => state.categories,
  cuisines: state => state.cuisines,
  // resultsIndex: state => state.resultsIndex,
  restaurantList: state => state.restaurantList,
  currentRestaurant: state => state.restaurantList[0],
  loadingRestaurants: state => state.loadingRestaurants
}

const actions = {
  get_city({ commit, dispatch, getters }, query) {
    return axios.get(`${zomatoUrl}/cities?q=${query}`, axiosConfig).then(async(response) => {
      const cities = response.data.location_suggestions
      if (cities.length) {
        commit('set_city_id', cities[0].id)
        console.log('comm on, categories', getters.categories)
        if (!getters.categories.length) {
          await dispatch('get_categories')
        }
        await dispatch('get_cuisines')
        return dispatch('get_next_restaurants')
      }
      return response
    })
  },
  get_categories({ commit, dispatch, getters }) {
    return axios.get(`${zomatoUrl}/categories`, axiosConfig).then(response => {
      console.log('categories response!', response.data.categories.map(item => item.categories.id))
      return commit('set_categories', response.data.categories.map(item => item.categories.id))
    })
  },
  get_cuisines({ commit, dispatch, getters }) {
    console.log('categories before cuisines?', getters.categories)
    const url = `${zomatoUrl}/cuisines?city_id=${getters.cityId}`
    return axios.get(url, axiosConfig).then(response => {
      console.log('cuisines response!', response.data.cuisines.map(item => item.cuisine.cuisine_id))
      return commit('set_cuisines', response.data.cuisines.map(item => item.cuisine.cuisine_id))
    })
  },
  async get_next_restaurants({ commit, dispatch, getters, rootGetters }) {
    commit('set_loading_restaurants', true)
    if (!rootGetters['collections/listFetched']('seen')) {
      await dispatch('collections/get_list', { listType: 'seen' }, { root: true })
    }
    const restaurantRequests = []
    for (let i = 0; i < 20; i++) {
      let category = getters.categories[Math.floor(Math.random() * getters.categories.length)]
      let cuisine = getters.cuisines[Math.floor(Math.random() * getters.cuisines.length)]
      const searchUrl = `${zomatoUrl}/search?entity_id=${getters.cityId}&entity_type=city&category=${category}&cuisines=${cuisine}`
      restaurantRequests.push(axios.get(searchUrl, axiosConfig))
    }

    Promise.all(restaurantRequests).then(results => {
      console.log(results)
      let newRestaurantList = results.map(response => response.data.restaurants.map(restaurant => restaurant.restaurant)).flat()
      if (newRestaurantList.length) {
        if (rootGetters['collections/total']('seen')) {
          newRestaurantList = newRestaurantList.filter(restaurant => {
            return !rootGetters['collections/ids']('seen').some(seenId => seenId === restaurant.id)
          })
        }
        commit('set_next_restaurants', newRestaurantList)
        commit('set_loading_restaurants', false)
      } else {
        return dispatch('get_next_restaurants')
      }
      return results
    })
  },
  swipe_restaurant({ commit, dispatch, getters, rootGetters }, didLikeRestaurant) {
    const listType = didLikeRestaurant ? 'liked' : 'disliked'
    const restaurant = Object.assign({}, getters.currentRestaurant)
    // commit('remove_current_restaurant')
    return dispatch('collections/add_to_list', { listType, restaurant }, { root: true }).then(() => {
      commit('remove_current_restaurant')
      console.log('what is current after remove?', getters.currentRestaurant)
      if (!getters.restaurantList.length) {
        return dispatch('get_next_restaurants')
      }
      return restaurant
    }).catch(err => {
      return err
    })
  }
}

const mutations = {
  set_city_id(state, id) {
    state.cityId = id
  },
  set_categories(state, newCategories) {
    state.categories = newCategories
  },
  set_cuisines(state, newCuisines) {
    state.cuisines = newCuisines
  },
  // set_results_index(state, increment) {
  //   state.resultsIndex += increment
  // },
  set_next_restaurants(state, restaurants) {
    // shuffle before setting
    let currentIndex = restaurants.length
    let temporaryValue, randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = restaurants[currentIndex]
      restaurants[currentIndex] = restaurants[randomIndex]
      restaurants[randomIndex] = temporaryValue
    }
    state.restaurantList = restaurants
  },
  remove_current_restaurant(state) {
    state.restaurantList.splice(0, 1)
  },
  set_loading_restaurants(state, status) {
    state.loadingRestaurants = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
