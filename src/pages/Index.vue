<template lang="pug">
div
  div.heightIndex.configIndex.bgYellowZe
    h6.colorText
      strong Bebidas geladas a preço de mercado na sua casa agora
    q-input.searchField(
      placeholder="Insira um endereço com número"
      v-model="paramSearch"
      outlined
      color="black"
      bg-color="white"
    )
      template(
        v-slot:prepend
      )
        q-icon(
          name='pin_drop'
        )
      SearchLocation(
        @search="getCurrentLocation()"
      )
  Info
</template>

<script>
import SearchLocation from '../components/homePage/SearchLocation.vue'
import Info from '../components/homePage/Info.vue'
import { request, gql } from 'graphql-request'

export default {
  name: 'Home',
  components: {
    SearchLocation,
    Info
  },
  data () {
    return {
      paramSearch: '',
      query: '',
      endpoint: ''
    }
  },
  watch: {
    paramSearch: function (val) {
      if (val !== '') {
        this.getProducts()
      }
    }
  },
  methods: {
    getProducts () {
      console.log('pokas')
    },
    getCurrentLocation () {
      console.log('teste')
    },
    async getDistribuitor () {
      this.query = gql`
        query PocSearch($pocSearchLong: String!, $pocSearchLat: String!) {
          pocSearch(long: $pocSearchLong, lat: $pocSearchLat) {
            id
            status
            name
          }
        }`
      this.endpoint = 'https://frontend-code-challenge-api.ze.delivery/graphql'
      try {
        const response = await request(this.endpoint, this.query, {
          pocSearchLat: '-23.632919',
          pocSearchLong: '-46.709453'
        })
        console.log('response', response.pocSearch)
      } catch (error) {
        console.log('error', error)
      }
    }
  },
  mounted () {
    this.getDistribuitor()
  }
}
</script>
