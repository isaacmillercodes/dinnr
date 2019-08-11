<template>
  <div>
    <div v-if="!currentCityId">
      <CitySearch />
    </div>
    <div v-else>
      <div v-if="loadingRestaurants">
        <font-awesome-icon icon="spinner" spin size="6x" />
        <h1>Loading...</h1>
      </div>
      <div v-else>
        <b-container>
          <b-row>
            <b-col>
              <font-awesome-icon class="dislike hover-icon" icon="times-circle" flip="horizontal" size="6x" @click="judgeRestaurant(false)" />
            </b-col>
            <b-col cols="8">
              <div class="current-restaurant-container">
                <transition :name="transitionType" mode="out-in">
                  <RestaurantCard :restaurant="currentRestaurant" :key="currentRestaurant.id" />
                </transition>
              </div>
            </b-col>
            <b-col>
              <font-awesome-icon class="like hover-icon" icon="utensils" size="6x" @click="judgeRestaurant(true)" />
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
  data() {
    return {
      transitionType: 'slide-right'
    }
  },
  methods: {
    ...mapActions('restaurants', [
      'swipe_restaurant'
    ]),
    judgeRestaurant(liked) {
      this.transitionType = liked ? 'slide-right' : 'slide-left'
      return this.swipe_restaurant(liked).then(results => {
        return results
      })
    }
  },
  computed: {
    ...mapGetters('restaurants', [
      'currentCityId',
      'loadingRestaurants',
      'currentRestaurant'
    ])
  }
}
</script>

<style lang="scss">
  .hover-icon:hover {
    cursor: pointer;
  }
  .like, .dislike {
    margin-top: 40%;
  }
  .like {
    color: #2DCC23;
  }
  .dislike {
    color: #FF5B45;
  }
  .slide-left-enter-active,
  .slide-right-enter-active,
  .slide-left-leave-active,
  .slide-right-leave-active {
    transition-duration: 0.5s;
    transition-property: height, opacity, transform;
    transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
    overflow: hidden;
  }

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    transform: translate(2em, 0);
  }

  .slide-right-enter,
  .slide-left-leave-active {
    opacity: 0;
    transform: translate(-2em, 0);
  }
</style>
