<template>
  <div>
    <b-container>
      <b-card :header="restaurant.name" class="text-center">
        <b-row no-gutters>
          <b-col xs="6">
            <b-card-img :src="restaurant.featured_image" class="rounded-0"></b-card-img>
          </b-col>
          <b-col xs="6">
            <b-card-body>
              <b-card-text>
                {{restaurant.location.address}}
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
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
