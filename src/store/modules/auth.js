import firebase from 'firebase'

const state = {
  user: null
}

const getters = {
  userId: state => state.user.uid,
  userName: state => state.user.displayName,
  userEmail: state => state.user.email
}

const actions = {
  register ({ commit, state }, { displayName, email, password }) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        const current = firebase.auth().currentUser
        return current.updateProfile({ displayName }).then(() => {
          resolve(user)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  login ({ commit, state }, { email, password }) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        resolve(user)
      }).catch(err => {
        reject(err)
      })
    })
  },
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => {
          commit('logout')
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  checkUserStatus ({ commit, state }) {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          commit('set_user', user)
          resolve(user)
        } else {
          reject(new Error('User is not logged in.'))
        }
      })
    })
  }
}

const mutations = {
  logout (state) {
    state.user = null
  },
  set_user (state, user) {
    state.user = user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
