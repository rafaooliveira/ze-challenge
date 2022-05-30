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
export default {
  name: 'Home',
  components: {
    SearchLocation,
    Info
  },
  data () {
    return {
      paramSearch: ''
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
    }
  },
  mounted () {
    try {
      const response = 'https://frontend-code-challenge-api.ze.delivery/graphql'
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
