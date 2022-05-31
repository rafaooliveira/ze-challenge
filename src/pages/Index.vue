<template lang="pug">
div
  div.heightIndex.configIndex.bgYellowZe
    h6.colorText
      strong Bebidas geladas a preço de mercado na sua casa agora
    q-input.searchField.bgColorWhite(
      placeholder="Insira um endereço com número"
      v-model="paramSearch"
      outlined
      color="black"
      @change="getParams"
    )
      template(
        v-slot:prepend
      )
        q-icon(
          name='pin_drop'
        )
    q-btn.q-my-xs.searchField.yellowZe.bgColorWhite(
      v-if="!this.paramSearch.length"
      label="Buscar minha localização"
      @click="pushToMap()"
      icon="location_searching"
    )
    div.row.q-my-sm
      q-input.bgColorWhite(
        label="Número"
        style="width: 40% !important"
        :rules='[val => val && val.length >= 0 || "Campo obrigatório"]'
        v-model="params.number"
        outlined
        hide-bottom-space
      )
      q-input.bgColorWhite.q-mx-sm(
        label="Complemento"
        style="width: 50% !important"
        :rules='[val => val && val.length >= 0 || "Campo obrigatório"]'
        v-model="params.complement"
        outlined
        hide-bottom-space
      )
    q-btn(
      label="Ver Produtos Disponiveis"
      @click="moveProducts()"
      :disable="behavior.disable"
      :loading="behavior.loading"
      rounded
    )
  Info
</template>

<script>
import Info from '../components/homePage/Info.vue'
import { request, gql } from 'graphql-request'

export default {
  name: 'Home',
  components: {
    Info
  },
  data () {
    return {
      behavior: {
        loading: false,
        disable: false
      },
      paramSearch: '',
      query: '',
      endpoint: 'https://frontend-code-challenge-api.ze.delivery/graphql',
      tokenMapbox: 'pk.eyJ1IjoicmFmYW9vbGl2ZWlyYSIsImEiOiJja3YwYXBxMG83a3I1MnFuemdpaXV0dTUxIn0.f_wybQ1DSPkAmzsK-fi8og',
      params: {
        text: '',
        latitude: '',
        longitude: '',
        place_name: '',
        number: '',
        complement: ''
      },
      latitude: '',
      longitude: ''
    }
  },
  // watch: {
  //   'behavior.disable': function (val) {
  //     if (!this.params.number || !this.params.complement || !this.paramsSearch) {
  //       val = !val
  //     }
  //   }
  // },
  methods: {
    moveProducts () {
      this.$router.push('/products')
    },
    pushToMap () {
      this.$router.push('/map')
    },
    getProducts () {
      console.log('pokas')
    },
    getLatLng () {
      console.log('teste')
    },
    async getParams () {
      if (this.paramSearch !== '') {
        try {
          const response = await this.$axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.paramSearch}.json?access_token=${this.tokenMapbox}`)
          console.log('response', response)
          this.params = {
            place_name: response.data?.features[0]?.place_name,
            text: response.data?.features[0]?.text,
            longitude: response.data?.features[0]?.center[0],
            latitude: response.data?.features[0]?.center[1]
          }
          console.log('params', this.params)
          this.paramSearch = this.params.place_name
          this.getDistribuitor(this.params)
        } catch (error) {
          console.log('error', error)
          this.$q.notify({
            type: 'negative',
            messge: 'Erro ao buscar latitude'
          })
        }
      } else {
        this.$q.notify({
          type: 'warning',
          message: 'Preencha o campo de busca'
        })
      }
    },
    async getDistribuitor (val) {
      const latitude = val.latitude
      const longitude = val.longitude
      this.query = gql`
        query PocSearch($pocSearchLong: String!, $pocSearchLat: String!) {
          pocSearch(long: $pocSearchLong, lat: $pocSearchLat) {
            id
            status
            name
          }
        }`
      try {
        const response = await request(this.endpoint, this.query, {
          pocSearchLong: longitude.toString(),
          pocSearchLat: latitude.toString()
        })
        if (!response.pocSearch.length) {
          this.$q.notify({
            type: 'warning',
            message: 'Não foi encontrado nenhum distribuidor tente novamente'
          })
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao buscar Distribuidor'
        })
      }
    }
  }
}
</script>
