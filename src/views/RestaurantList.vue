<template>
  <div>
    <div>
      <div v-if="loading">
        <font-awesome-icon icon="spinner" spin size="6x" />
        <h1>Loading...</h1>
      </div>
      <div v-else>
        <b-container>
          <b-row>
            <b-col sm="8">
                <b-dropdown
                  variant="default"
                  :text="listTitle"
                  size="lg"
                >
                  <b-dropdown-item @click="toggleList('liked')">Liked Restaurants</b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item @click="toggleList('disliked')">Disliked Restaurants</b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item @click="toggleList('seen')">All Restaurants</b-dropdown-item>
                </b-dropdown>
            </b-col>
            <b-col sm="2">
              <b-form-input v-model="searchTerm" placeholder="Search..."></b-form-input>
            </b-col>
            <b-col sm="2">
              <b-form-select v-model="sortBy" :options="sortOptions"></b-form-select>
            </b-col>
          </b-row>
        </b-container>
        <b-container>
          <b-row>
            <b-col sm="8" offset-sm="2">
              <div v-if="sortedList.length">
                <RestaurantCard class="restaurant-list-card" v-for="restaurant in sortedList" :restaurant="restaurant" :key="restaurant.id" />
              </div>
              <h4 v-else>No Results Found</h4>
            </b-col>
          </b-row>
        </b-container>

      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import RestaurantCard from '../components/RestaurantCard'
export default {
  name: 'RestaurantList',
  components: {
    RestaurantCard
  },
  data() {
    return {
      loading: true,
      listType: 'liked',
      sortBy: 'Most Recent',
      searchTerm: '',
      sortOptions: [
        'Most Recent',
        'Cost, High to Low',
        'Cost, Low to High',
        'Rating, High to Low',
        'Rating, Low to High'
      ]
    }
  },
  async mounted() {
    if (!this.listFetched('liked')) {
      await this.get_list({ listType: 'liked' })
    }
    this.loading = false
  },
  methods: {
    ...mapActions('collections', [
      'get_list'
    ]),
    async toggleList(type) {
      console.log('toggle list: ', type)
      if (!this.listFetched(type)) {
        this.loading = true
        await this.get_list({ listType: type })
        this.loading = false
      }
      this.listType = type
    },
    sortList(list, propertyString, isDescending) {
      console.log('list?', list)
      if (this.searchTerm.length) {
        list = list.filter(restaurant => {
          const valuesToCheck = [
            restaurant.name.toLowerCase(),
            restaurant.cuisines.toLowerCase(),
            restaurant.location.locality_verbose.toLowerCase()
          ]
          return valuesToCheck.some(value => value.includes(this.searchTerm.toLowerCase()))
        })
      }
      if (!propertyString) {
        return list
      }
      const sorted = list.sort((a, b) => {
        const propertiesList = propertyString.split('.')
        let aValue = a[propertiesList[0]]
        let bValue = b[propertiesList[0]]
        for (let i = 1; i < propertiesList.length; i++) {
          aValue = aValue[propertiesList[1]]
          bValue = bValue[propertiesList[1]]
        }
        if (aValue > bValue) {
          return isDescending ? -1 : 1
        }
        if (aValue < bValue) {
          return isDescending ? 1 : -1
        }
        return 0
      })

      return sorted
    }
  },
  computed: {
    ...mapGetters('collections', [
      'total',
      'ids',
      'details',
      'listFetched'
    ]),
    sortedList() {
      switch (this.sortBy) {
        case 'Most Recent':
          return this.sortList([...this.details(this.listType)])
        case 'Cost, High to Low':
          return this.sortList([...this.details(this.listType)], 'average_cost_for_two', true)
        case 'Cost, Low to High':
          return this.sortList([...this.details(this.listType)], 'average_cost_for_two', false)
        case 'Rating, High to Low':
          return this.sortList([...this.details(this.listType)], 'user_rating.aggregate_rating', true)
        case 'Rating, Low to High':
          return this.sortList([...this.details(this.listType)], 'user_rating.aggregate_rating', false)
        default:
          return this.sortList([...this.details(this.listType)])
      }
    },
    listTitle() {
      switch (this.listType) {
        case 'liked':
          return 'Liked Restaurants'
        case 'disliked':
          return 'Disliked Restaurants'
        case 'seen':
          return 'All Restaurants'
        default:
          return 'Restaurants'
      }
    }
  }
}
</script>

<style lang="scss">
  .restaurant-list-card {
    margin: 16px 0;
  }
</style>
