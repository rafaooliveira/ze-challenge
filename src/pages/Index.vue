<template lang="pug">
div
  div.heightIndex.configIndex.bgYellowZe
    h6.colorText
      strong Bebidas geladas a preço de mercado na sua casa agora
    q-input.searchField.bgColorWhite(
      placeholder="Insira um endereço com número"
      v-model="params.search"
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
      v-if="!this.params.search"
      label="Buscar minha localização"
      @click="goToMap"
      icon="location_searching"
    )
    div.row.q-my-sm
      q-input.bgColorWhite(
        v-show="this.params.search"
        label="Número"
        style="width: 40% !important"
        :rules='[val => val && val.length >= 0 || "Campo obrigatório"]'
        v-model="params.number"
        outlined
        hide-bottom-space
        @change="getAddressWithNumber()"
        :autofocus="focus"
        type="number"
      )
      q-input.bgColorWhite.q-mx-sm(
        v-show="this.params.search"
        label="Complemento"
        style="width: 50% !important"
        v-model="params.complement"
        outlined
        hide-bottom-space
      )
    q-btn(
      label="Ver Produtos Disponíveis"
      @click="goToProducts"
      :disable="(this.params.search && this.params.number && this.params.complement) ? false : true"
      :loading="behavior.loading"
      :color="(this.params.search && this.params.number && this.params.complement) ? 'yellow-9' : 'grey-9'"
      :text-color="(this.params.search && this.params.number && this.params.complement) ? 'black-9' : 'white-9'"
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
        disable: true
      },
      query: '',
      endpoint: 'https://frontend-code-challenge-api.ze.delivery/graphql',
      tokenMapbox: 'pk.eyJ1IjoicmFmYW9vbGl2ZWlyYSIsImEiOiJja3YwYXBxMG83a3I1MnFuemdpaXV0dTUxIn0.f_wybQ1DSPkAmzsK-fi8og',
      params: {
        search: '',
        text: '',
        latitude: '',
        longitude: '',
        place_name: '',
        number: '',
        complement: ''
      },
      latitude: '',
      longitude: '',
      focus: false
    }
  },
  methods: {
    getAddressWithNumber () {
      if (this.params.number !== undefined) {
        this.params.search = `${this.params.search}, ${this.params.number}`
        this.getParams()
      } else {
        this.focus = true
      }
    },
    goToMap () {
      this.$router.push('/map')
    },
    goToProducts () {
      this.$q.sessionStorage.set('id-distribuition', this.dataDistribuition[0].id.toString())
      this.$router.push('/products')
    },
    async getParams () {
      if (this.params.search !== '') {
        try {
          const response = await this.$axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.params.search}.json?access_token=${this.tokenMapbox}`)
          if ((this.params.search.match(/,/g) || []).length) {
            this.params = {
              search: this.params.search,
              number: this.params.number,
              place_name: response.data?.features[0]?.place_name,
              text: response.data?.features[0]?.text,
              longitude: response.data?.features[0]?.center[0],
              latitude: response.data?.features[0]?.center[1]
            }
          } else {
            this.params = {
              search: response.data?.features[0]?.text,
              place_name: response.data?.features[0]?.place_name,
              text: response.data?.features[0]?.text,
              longitude: response.data?.features[0]?.center[0],
              latitude: response.data?.features[0]?.center[1]
            }
          }

          if (this.params.number) {
            await this.getDistribuitor(this.params)
          }
        } catch (error) {
          this.$q.notify({
            position: 'top-right',
            type: 'negative',
            messge: 'Erro ao buscar endereço'
          })
        }
      } else {
        this.$q.notify({
          position: 'top-right',
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
            position: 'top-right',
            type: 'warning',
            message: 'Não foi encontrado nenhum distribuidor tente novamente'
          })
          this.params = {
            search: '',
            number: '',
            complement: ''
          }
        } else {
          this.dataDistribuition = response.pocSearch
          this.behavior.disable = false
        }
      } catch (error) {
        this.$q.notify({
          position: 'top-right',
          type: 'negative',
          message: 'Erro ao buscar Distribuidor'
        })
      }
    }
  },
  mounted () {
    this.$q.sessionStorage.set('id-distribuition', '')
  }
}
</script>
