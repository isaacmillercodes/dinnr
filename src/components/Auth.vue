<template>
  <div>

    <h1>{{ formTitle }}</h1>
    <div>
      <button @click="toggleRegister()">{{ toggleText }} </button>
    </div>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group id="input-group-1" label="Your Name:" label-for="input-1" v-if="isRegister">
        <b-form-input
          id="input-1"
          v-model="name"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Email address:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Password:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="password"
          type="password"
          required
          placeholder="Password"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Auth',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      isRegister: false
    }
  },
  mounted () {
    this.fetch_list()
  },
  methods: {
    ...mapActions('auth', [
      'register',
      'login'
    ]),
    ...mapActions('collections', [
      'fetch_list'
    ]),
    toggleRegister () {
      this.isRegister = !this.isRegister
    },
    onSubmit () {
      return this.register({ name: this.name, email: this.email, password: this.password }).then(() => {
        console.log('done!')
      })
    },
    reset () {
      this.name = ''
      this.email = ''
      this.password = ''
    }
  },
  computed: {
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
