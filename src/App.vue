<template>
  <div id="app">
    <div id="nav" v-if="userIsLoggedIn">
      <div v-if="!onHomePage">
        <a class="link" @click.prevent="goToRestaurantSelect(false)">Find Restaurants
          <span v-if="currentCityId">
            in {{ currentCityName }}
          </span>
        </a>
        <span v-if="currentCityId"> |
          <a class="link" v-if="currentCityId" @click.prevent="goToRestaurantSelect(true)">Change City</a>
        </span>
      </div>
      <div v-else>
        <b-link to="/restaurants">Your Restaurants</b-link>
      </div>
    </div>
    <router-view/>
    <div id="footer" v-if="userIsLoggedIn">
      <a @click.prevent="triggerLogout()" class="logout-link link">Log Out {{ userName }}</a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  mounted() {
    this.checkUserStatus()
  },
  methods: {
    ...mapActions([
      'change_home_component',
      'go_to_route'
    ]),
    ...mapActions('auth', [
      'checkUserStatus',
      'logout'
    ]),
    ...mapActions('restaurants', [
      'reset_city'
    ]),
    goToRestaurantSelect(shouldReset) {
      if (shouldReset) {
        this.reset_city()
      }
      this.go_to_route({ path: '/' })
    },
    triggerLogout() {
      return this.logout().then(() => this.change_home_component('Auth'))
    }
  },
  computed: {
    ...mapGetters([
      'homeComponent'
    ]),
    ...mapGetters('auth', [
      'userIsLoggedIn',
      'userName'
    ]),
    ...mapGetters('restaurants', [
      'currentCityId',
      'currentCityName'
    ]),
    onHomePage() {
      return this.$route.name === 'Home'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav, #footer {
  padding: 30px;
  a {
    font-weight: bold;
    color: #42b983;
    &.logout-link {
      color: #2c3e50;
    }
  }
  a:hover {
    cursor: pointer;
  }
}
</style>
