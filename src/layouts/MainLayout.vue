<template lang="pug">
  q-layout(
    view="lHh Lpr lFf"
  )
    q-header
      div.spacing.header
        q-img.logoZe(
          src="https://courier-images-web.imgix.net/static/img/white-logo.png?auto=compress,format&fit=max&w=undefined&h=undefined&dpr=2&fm=png"
        )
        q-btn.enterBtn(
          label="Entrar"
          @click="enter()"
        )
    q-page-container
      router-view
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
    }
  },
  methods: {
    enter () {
      console.log('teste')
    }
  }
}
</script>
