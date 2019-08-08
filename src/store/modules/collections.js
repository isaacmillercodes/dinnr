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
  }
}

const getters = {
  total: state => listType => state[listType].list.length,
  ids: state => listType => state[listType].list.map(restaurant => restaurant.id),
  details: state => listType => state[listType].list,
  listFetched: state => listType => state[listType].fetched
}

const actions = {
  get_list ({ dispatch, commit, state, rootState, getters, rootGetters }, listType) {
    firebase.firestore().collection(`users/${rootGetters.auth.userId}/collections/${listType}`).get().then((querySnapshot) => {
      console.log('query snapshot: ', querySnapshot)
      querySnapshot.forEach((doc) => {
        console.log('collection: ')
        console.log(doc.data())
      })
    })
  }
}

const mutations = {

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
