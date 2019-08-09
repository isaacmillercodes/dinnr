<template>
  <div>
    <div v-if="!cityId">
      <CitySearch />
    </div>
    <div v-else>
      <div v-if="currentRestaurant">
        <b-container>
          <b-row align-v="center">
            <b-col>
              <font-awesome-icon icon="times-circle" size="6x" @click="swipe_restaurant(false)" />
            </b-col>
            <b-col cols="8">
              <RestaurantCard :restaurant="currentRestaurant" v-if="currentRestaurant" />
            </b-col>
            <b-col>
              <font-awesome-icon icon="utensils" size="6x" @click="swipe_restaurant(true)" />
            </b-col>
          </b-row>
        </b-container>

      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import CitySearch from './CitySearch'
import RestaurantCard from './RestaurantCard'
export default {
  name: 'SelectRestaurant',
  components: {
    CitySearch,
    RestaurantCard
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('restaurants', [
      'swipe_restaurant'
    ])
  },
  computed: {
    ...mapGetters('restaurants', [
      'cityId',
      'currentRestaurant'
    ])
  }
}
</script>

<style lang="scss">

</style>
