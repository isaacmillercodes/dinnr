<template>
  <div>
    <b-container>
      <b-row>
        <b-col sm="8" offset-sm="2">
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
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CitySearch',
  data() {
    return {
      searchTerm: ''
    }
  },
  methods: {
    ...mapActions('restaurants', [
      'get_city'
    ]),
    submitSearch() {
      this.get_city(this.searchTerm)
    }
  }
}
</script>

<style lang="scss">

</style>
