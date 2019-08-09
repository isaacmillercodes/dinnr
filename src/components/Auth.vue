<template>
  <div>
    <b-container>
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
        <div>
          <b-button @click="submitAuth()" type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset Form</b-button>
          <b-button @click="toggleRegister()" variant="success">{{ toggleText }} </b-button>
        </div>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Auth',
  data () {
    return {
      displayName: '',
      email: '',
      password: '',
      isRegister: false
    }
  },
  mounted () {
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
    toggleRegister () {
      this.isRegister = !this.isRegister
    },
    submitAuth () {
      const vm = this
      const reqBody = { email: vm.email, password: vm.password }
      let authMethod = null
      if (vm.isRegister) {
        reqBody.displayName = vm.displayName
        authMethod = vm.register(reqBody)
      } else {
        authMethod = vm.login(reqBody)
      }
      console.log('authmethod?')
      return authMethod.then(response => {
        console.log('auth done!', response)
        vm.checkUserStatus()
        console.log('user getter: ', vm.userId, vm.userName, vm.userEmail)
        this.change_home_component('SelectRestaurant')
        return response
      })
    },
    resetForm () {
      this.displayName = ''
      this.email = ''
      this.password = ''
    }
  },
  computed: {
    ...mapGetters('auth', [
      'userIsLoggedIn',
      'userId',
      'userName',
      'userEmail'
    ]),
    formTitle () {
      return this.isRegister ? 'Register' : 'Login'
    },
    toggleText () {
      return this.isRegister ? 'Login?' : 'Create Account?'
    }
  }
}
</script>

<style lang="scss">

</style>
