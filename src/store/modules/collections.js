import firebase from 'firebase'

const state = {
  seen: {
    total: null,
    id_list: [],
    detail_list: []
  },
  liked: {
    total: null,
    id_list: [],
    detail_list: []
  },
  disliked: {
    total: null,
    id_list: [],
    detail_list: []
  },
  reviewed: {
    total: null,
    id_list: [],
    detail_list: []
  }
}

const getters = {
  total: state => listType => state[listType].total,
  ids: state => listType => state[listType].id_list,
  details: state => listType => state[listType].detail_list
}

const actions = {
  fetch_list ({ dispatch, commit, state, rootState, getters, rootGetters }, listType) {
    firebase.firestore().collection(`users/${rootGetters.auth.userId}/collections/${listType}`).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
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
