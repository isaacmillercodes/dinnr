<template>
  <div id="app">
    <div id="nav" v-if="userIsLoggedIn">
      <b-link to="/" v-if="$route.name === 'RestaurantList'">Find Restaurants</b-link>
      <b-link to="/restaurants" v-if="$route.name === 'Home'">Your Restaurants</b-link> |
      <b-link @click="triggerLogout()">Log Out</b-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mounted() {
      console.log(this.$route)
    },
    methods: {
      ...mapActions([
        'change_home_component'
      ]),
      ...mapActions('auth', [
        'logout'
      ]),
      triggerLogout() {
        return this.logout().then(() => this.change_home_component('Auth'))
      }
    },
    computed: {
      ...mapGetters([
        'homeComponent'
      ]),
      ...mapGetters('auth', [
        'userIsLoggedIn'
      ])
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
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
