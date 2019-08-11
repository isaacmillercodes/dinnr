<template>
  <div>
    <b-container class="restaurant-card-container">
      <b-card :header="restaurant.name + ', ' + restaurant.location.locality_verbose" class="text-center">
        <b-row no-gutters>
          <b-col xs="6">
            <b-card-img fluid class="restaurant-image" :src="restaurant.featured_image.length ? restaurant.featured_image : 'https://picsum.photos/id/192/200/300'"></b-card-img>
          </b-col>
          <b-col xs="6">
            <b-card-body>
              <b-card-text>
                <b-container>
                  <b-row>
                    <b-col>
                      <p>{{restaurant.cuisines}}</p>
                    </b-col>
                    <b-col>
                      <p>{{restaurant.establishment[0]}}</p>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <p>Average Cost For Two: {{restaurant.currency}}{{restaurant.average_cost_for_two}}</p>
                    </b-col>
                    <b-col>
                      <p>Average Customer Rating: {{restaurant.user_rating.aggregate_rating}}</p>
                    </b-col>
                  </b-row>
                  <b-row>
                  </b-row>
                </b-container>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'RestaurantCard',
  props: ['restaurant'],
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="scss">
  .restaurant-card-container {
    height: 300px;
  }
  .restaurant-image {
    height: 200px;
    width: 300px;
  }
</style>
