<template lang="pug">
q-popup-proxy
  q-btn.yellowZe(
    style="width: 100% !important"
    label="Buscar minha localização"
    @click="getLocation()"
    icon="location_searching"
  )
</template>

<script>
export default {
  name: 'SearchLocation',
  methods: {
    getLocation () {
      this.$router.push('/mapa')
      this.$emit('search')
    }
  }
}
</script>
