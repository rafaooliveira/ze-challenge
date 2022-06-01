<template lang="pug">
div
  Header
  q-card.q-pt-xl
    q-list.row.justify-center
      div(
        v-for="item in dataCategories" :key="item.id"
      )
        q-btn.q-mx-sm(
          outlined
          :label='item.title'
          @click="filterCategory(item.id)"
        )
    q-list.row.justify-center
      div(
        v-for="item in dataProducts" :key="item.id"
      )
        q-card.q-ma-sm(
          style="height: 310px !important; max-width: 200px !important"
        )
          q-img(
            :src="item.image"
            style="height: 140px !important; width: 140px !important;"
          )
          q-separator.q-my-xs
          q-card-section
            q-item
              q-item-label.text-bold {{item.title}}
            q-item.q-mt-md
              q-item-label.text-green {{ item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
</template>

<script>
import Header from '../layouts/MainLayout.vue'
import { request, gql } from 'graphql-request'

export default {
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  name: 'Products',
  components: {
    Header
  },
  data () {
    return {
      idDistrib: '',
      endpoint: 'https://frontend-code-challenge-api.ze.delivery/graphql',
      queryProducts: '',
      queryCategories: '',
      dataProducts: [],
      dataProductsFilter: [],
      dataCategories: [],
      params: ''
    }
  },
  methods: {
    async filterCategory (filter) {
      this.dataProducts = this.dataProductsFilter.filter((productFiltred) => {
        return productFiltred.category.id === filter
      })
    },
    async listCategories () {
      this.$q.loading.show({
        message: 'Carregando Produtos...'
      })
      try {
        const responseCategories = await request(this.endpoint, this.queryCategories)
        this.dataCategories = responseCategories.categories
        if (!this.dataCategories) {
          this.$q.notify({
            type: 'warning',
            message: 'Sem categorias disponíveis'
          })
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao carregar categorias...'
        })
      } finally {
        this.$q.loading.hide()
      }
    },
    async getDistribuitionLocal (val) {
      try {
        this.idDistrib = val
        const responseProducts = await request(this.endpoint, this.queryProducts, {
          pocId: this.idDistrib,
          productsSearch: null,
          productsCategoryId: null
        })
        this.dataProducts = responseProducts?.poc?.products
        this.dataProductsFilter = responseProducts?.poc?.products
        this.listCategories()
      } catch (error) {
        this.$q.notify({
          type: '',
          message: ''
        })
      }
    }
  },
  mounted () {
    this.queryCategories = gql`
      query Categories {
        categories {
          id
          title
        }
      }
    `
    this.queryProducts = gql`
      query Poc(
        $pocId: String!
        $productsSearch: String
        $productsCategoryId: String
      ) {
        poc(id: $pocId) {
          id
          status
          name
          products(search: $productsSearch, categoryId: $productsCategoryId) {
          id
          title
          image
          price
          category {
            id
            title
          }
        }
      }
    }`
    this.params = this.$q.sessionStorage.getItem('id-distribuition')
    this.getDistribuitionLocal(this.params)
  }
}
</script>
