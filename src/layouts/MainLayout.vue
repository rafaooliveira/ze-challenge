<template lang="pug">
  q-layout.configLayout(
    view="hhh lpr fff"
  )
    q-header
      div.spacing.header(
        :class="this.$route.path !== '/products' ? 'spacing' : 'justify-content: justify-between'"
      )
        q-img.logoZe(
          src="https://courier-images-web.imgix.net/static/img/white-logo.png?auto=compress,format&fit=max&w=undefined&h=undefined&dpr=2&fm=png"
        )
        q-btn.enterBtn(
          label="Entrar"
          @click="enter()"
        )
        q-btn.enterBtn(
          icon="shopping_bag"
          text-color="white"
          @click="showProductsList"
          v-if="this.$route.path === '/products'"
          flat
        )
    q-page-container(
      v-if="this.$route.path === '/'"
    )
      router-view
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {}
  },
  methods: {
    showProductsList () {
      this.$q.notify({
        type: 'warning',
        message: 'Nova feature em breve...'
      })
    }
  }
}
</script>

<style>
.configLayout {
  min-height: 10vh !important;
}
</style>
