import firebase from 'firebase'

const state = {
  seen: {
    list: [],
    fetched: false
  },
  liked: {
    list: [],
    fetched: false
  },
  disliked: {
    list: [],
    fetched: false
  },
  loadingList: false
}

const getters = {
  total: state => listType => state[listType].list.length,
  ids: state => listType => state[listType].list.map(restaurant => restaurant.id),
  details: state => listType => state[listType].list,
  listFetched: state => listType => state[listType].fetched,
  loadingList: state => state.loadingList
}

const actions = {
  get_list({ dispatch, commit, state, rootState, getters, rootGetters }, { listType }) {
    commit('set_loading_list', true)
    return firebase.firestore()
      .collection('users')
      .doc(`${rootGetters['auth/userId']}`)
      .collection(`${listType}`)
      .get().then(querySnapshot => {
        const newList = []
        querySnapshot.forEach(doc => {
          newList.push(doc.data())
        })
        commit('set_list', { list: newList, listType })
        commit('set_loading_list', false)
        return newList
      }).catch(err => {
        return err
      })
  },
  add_to_list({ dispatch, commit, state, rootState, getters, rootGetters }, { listType, restaurant }) {
    const judged = firebase.firestore()
      .collection('users')
      .doc(`${rootGetters['auth/userId']}`)
      .collection(`${listType}`)
      .doc(restaurant.id)
      .set(restaurant)

    const seen = firebase.firestore()
      .collection('users')
      .doc(`${rootGetters['auth/userId']}`)
      .collection('seen')
      .doc(restaurant.id)
      .set(restaurant)

    return Promise.all([judged, seen]).then(results => {
      commit('insert_into_list', { listType, restaurant })
      return results
    }).catch(err => {
      return err
    })
  }
}

const mutations = {
  set_list(state, { list, listType }) {
    state[listType].list = list
    state[listType].fetched = true
  },
  insert_into_list(state, { listType, restaurant }) {
    state[listType].list.push(restaurant)
    state.seen.list.push(restaurant)
  },
  set_loading_list(state, status) {
    state.loadingList = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
