import firebase from 'firebase'

const state = {
  user: {
    uid: null,
    displayName: '',
    email: ''
  },
  userIsLoggedIn: false
}

const getters = {
  userIsLoggedIn: state => state.userIsLoggedIn,
  userId: state => state.user.uid,
  userName: state => state.user.displayName,
  userEmail: state => state.user.email
}

const actions = {
  register ({ commit, state }, { displayName, email, password }) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      const current = firebase.auth().currentUser
      return current.updateProfile({ displayName }).then(() => {
        return user
      }).catch(err => {
        return err
      })
    }).catch(err => {
      return err
    }).catch(err => {
      return err
    })
  },
  login ({ commit, state }, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
      return user
    }).catch(err => {
      return err
    })
  },
  logout ({ commit, state }) {
    return firebase.auth().signOut().then(() => {
      commit('logout')
    }).catch((err) => {
      return err
    })
  },
  checkUserStatus ({ commit, state }) {
    console.log('firing check user status!')
    return firebase.auth().onAuthStateChanged((user) => {
      console.log('auth state changed!', user)
      if (user.uid) {
        commit('set_user', user)
        commit('set_user_logged_in', true)
        return user
      } else {
        return new Error('User is not logged in.')
      }
    })
  }
}

const mutations = {
  logout (state) {
    state.user = null
  },
  set_user (state, { uid, displayName, email }) {
    state.user = { uid, displayName, email }
  },
  set_user_logged_in (state, loggedInState) {
    state.userIsLoggedIn = loggedInState
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
