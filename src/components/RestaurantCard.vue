<template>
  <div>
    <b-container class="restaurant-card-container">
      <b-card no-body class="overflow-hidden">
        <b-row align-v="center" class="title-row">
          <b-col>
            <b-card-title>
              {{restaurant.name}}
              <!-- <span class="card-subtitle text-muted"><h6>{{restaurant.location.locality_verbose}}</h6></span> -->
            </b-card-title>
          </b-col>
          <b-col>
            <b-card-sub-title>
              {{restaurant.location.locality_verbose}}
            </b-card-sub-title>
          </b-col>
        </b-row>
        <b-row no-gutters>
          <b-col md="6">
            <b-card-img
              :src="restaurant.featured_image.length ? restaurant.featured_image : 'https://picsum.photos/id/192/400/600/?blur=1'"
              class="rounded-0 restaurant-image"
              img-alt="Restaurant Image"
            >
            </b-card-img>
          </b-col>
          <b-col md="6">
            <b-card-body>
              <b-card-text>
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
    max-height: 300px;
  }
  .title-row {
    margin-top: 8px;
  }
  .restaurant-card-container .restaurant-image {
    height: 225px;
    width: 350px;
    object-fit: cover;
    object-position: 50% 50%;
  }
</style>
