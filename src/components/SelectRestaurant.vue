<template>
  <div>
    Restaurant Time, baby
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'selectRestaurant',
  data () {
    return {

    }
  },
  mounted () {
    this.get_city('denver')
  },
  methods: {
    ...mapActions('restaurants', [
      'get_city'
    ])
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
