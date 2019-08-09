<template>
  <div class="home">
    <component :is="homeComponent"></component>
  </div>
</template>

<script>

import Auth from '../components/Auth.vue'
import SelectRestaurant from '../components/SelectRestaurant.vue'

import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  components: {
    Auth,
    SelectRestaurant
  },
  data () {
    return {

    }
  },
  methods: {

  },
  computed: {
    ...mapGetters([
      'homeComponent'
    ])
  }
}
</script>
