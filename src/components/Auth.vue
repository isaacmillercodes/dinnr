<template>
  <div>
    <b-container>
      <b-row>
        <b-col sm="8" offset-sm="2">
          <b-card :title="formTitle" class="text-center">
            <b-form @submit.prevent="submitAuth()" @reset.prevent="resetForm">
              <b-form-group id="name-input-group" label="Your Name:" label-for="name-input" v-if="isRegister">
                <b-form-input
                  id="name-input"
                  v-model="displayName"
                  required
                  placeholder="Enter name"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="email-input-group"
                label="Email address:"
                label-for="email-input"
              >
                <b-form-input
                  id="email-input"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="password-input-group"
                label="Password:"
                label-for="password-input"
              >
                <b-form-input
                  id="password-input"
                  v-model="password"
                  type="password"
                  required
                  placeholder="Password"
                ></b-form-input>
              </b-form-group>
            </b-form>
            <b-container>
              <b-row align-h="center">
                <b-col class="text-right">
                  <b-button @click="submitAuth()" type="submit" variant="primary">Submit</b-button>
                </b-col>
                <b-col class="text-left">
                  <b-button @click="toggleRegister()" variant="success">{{ toggleText }} </b-button>
                </b-col>
              </b-row>
            </b-container>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Auth',
  data() {
    return {
      displayName: '',
      email: '',
      password: '',
      isRegister: false
    }
  },
  mounted() {
    if (this.userIsLoggedIn) {
      this.change_home_component('SelectRestaurant')
    }
  },
  methods: {
    ...mapActions([
      'change_home_component'
    ]),
    ...mapActions('auth', [
      'checkUserStatus',
      'register',
      'login'
    ]),
    toggleRegister() {
      this.isRegister = !this.isRegister
    },
    submitAuth() {
      const vm = this
      const reqBody = { email: vm.email, password: vm.password }
      let authMethod = null
      if (vm.isRegister) {
        reqBody.displayName = vm.displayName
        authMethod = vm.register(reqBody)
      } else {
        authMethod = vm.login(reqBody)
      }
      return authMethod.then(response => {
        vm.checkUserStatus()
        this.change_home_component('SelectRestaurant')
        return response
      })
    }
  },
  computed: {
    ...mapGetters('auth', [
      'userIsLoggedIn'
    ]),
    formTitle() {
      return this.isRegister ? 'Register' : 'Login'
    },
    toggleText() {
      return this.isRegister ? 'Login?' : 'Create Account?'
    }
  }
}
</script>

<style lang="scss">

</style>
