<template>
  <div>
    <b-container>
      <b-card :title="'Choose a City'" class="text-center">
        <b-form @submit.prevent="submitSearch()">
          <b-form-group id="city-search-input-group" label-for="city-search-input">
            <b-form-input
              id="city-search-input"
              v-model="searchTerm"
              required
              placeholder="Enter a city..."
            ></b-form-input>
          </b-form-group>
        </b-form>
        <div>
          <b-button @click="submitSearch()" type="submit" variant="primary">Search</b-button>
        </div>
      </b-card>
    </b-container>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CitySearch',
  data () {
    return {
      searchTerm: ''
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('restaurants', [
      'get_city'
    ]),
    submitSearch() {
      this.get_city(this.searchTerm)
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
