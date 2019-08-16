import axios from 'axios'

const zomatoUrl = 'https://developers.zomato.com/api/v2.1'
const axiosConfig = { headers: { 'user-key': process.env.VUE_APP_ZOMATO_KEY } }

const state = {
  currentCity: {
    id: null,
    name: ''
  },
  categories: [],
  cuisines: [],
  restaurantList: [],
  loadingRestaurants: true
}

const getters = {
  currentCityId: state => state.currentCity.id,
  currentCityName: state => state.currentCity.name,
  categories: state => state.categories,
  cuisines: state => state.cuisines,
  restaurantList: state => state.restaurantList,
  currentRestaurant: state => state.restaurantList[0],
  loadingRestaurants: state => state.loadingRestaurants
}

const actions = {
  get_city({ commit, dispatch, getters }, query) {
    return axios.get(`${zomatoUrl}/cities?q=${query}`, axiosConfig).then(async(response) => {
      commit('set_loading_restaurants', true)
      const cities = response.data.location_suggestions
      const { id, name } = cities[0]
      if (cities.length) {
        commit('set_city', { id, name })
        if (!getters.categories.length) {
          await dispatch('get_categories')
        }
        await dispatch('get_cuisines')
        return dispatch('get_next_restaurants')
      }
      return response
    })
  },
  reset_city({ commit }) {
    return new Promise(resolve => {
      commit('set_city', { id: null, name: '' })
      resolve()
    })
  },
  get_categories({ commit }) {
    return axios.get(`${zomatoUrl}/categories`, axiosConfig).then(response => {
      return commit('set_categories', response.data.categories.map(item => item.categories.id))
    })
  },
  get_cuisines({ commit, getters }) {
    const url = `${zomatoUrl}/cuisines?city_id=${getters.currentCityId}`
    return axios.get(url, axiosConfig).then(response => {
      return commit('set_cuisines', response.data.cuisines.map(item => item.cuisine.cuisine_id))
    })
  },
  async get_next_restaurants({ commit, dispatch, getters, rootGetters }) {
    commit('set_loading_restaurants', true)
    if (!rootGetters['collections/listFetched']('seen')) {
      await dispatch('collections/get_list', { listType: 'seen' }, { root: true })
    }
    const restaurantRequests = []
    const { categories, cuisines, currentCityId } = getters
    for (let i = 0; i < 20; i++) {
      let category = categories[Math.floor(Math.random() * categories.length)]
      let cuisine = cuisines[Math.floor(Math.random() * cuisines.length)]
      const searchUrl = `${zomatoUrl}/search?entity_id=${currentCityId}&entity_type=city&category=${category}&cuisines=${cuisine}`
      restaurantRequests.push(axios.get(searchUrl, axiosConfig))
    }

    return Promise.all(restaurantRequests).then(results => {
      let newRestaurantList = results.map(response => response.data.restaurants.map(restaurant => restaurant.restaurant)).flat()
      if (newRestaurantList.length) {
        if (rootGetters['collections/total']('seen')) {
          newRestaurantList = newRestaurantList.filter(restaurant => {
            return !rootGetters['collections/ids']('seen').some(seenId => seenId === restaurant.id)
          })
        }
        // shuffle before setting
        let currentIndex = newRestaurantList.length
        let temporaryValue, randomIndex
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex -= 1
          temporaryValue = newRestaurantList[currentIndex]
          newRestaurantList[currentIndex] = newRestaurantList[randomIndex]
          newRestaurantList[randomIndex] = temporaryValue
        }
        commit('set_next_restaurants', newRestaurantList)
        commit('set_loading_restaurants', false)
      } else {
        return dispatch('get_next_restaurants')
      }
      return results
    })
  },
  swipe_restaurant({ commit, dispatch, getters }, didLikeRestaurant) {
    const listType = didLikeRestaurant ? 'liked' : 'disliked'
    const { currentRestaurant, restaurantList } = getters
    const restaurant = Object.assign({}, currentRestaurant)
    return dispatch('collections/add_to_list', { listType, restaurant }, { root: true }).then(() => {
      commit('remove_current_restaurant')
      if (!restaurantList.length) {
        return dispatch('get_next_restaurants')
      }
      return restaurant
    }).catch(err => {
      return err
    })
  }
}

const mutations = {
  set_city(state, newCity) {
    state.currentCity = newCity
  },
  set_categories(state, newCategories) {
    state.categories = newCategories
  },
  set_cuisines(state, newCuisines) {
    state.cuisines = newCuisines
  },
  set_next_restaurants(state, restaurants) {
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
