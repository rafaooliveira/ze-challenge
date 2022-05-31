<template lang="pug">
div
  q-btn(
    icon="arrow_left"
    round
    @click="this.$router.push('/')"
  )
  div(id="mapid")
</template>

<style>
#mapid {
  height: 100vh;
}
</style>
<script>
import leaflet from 'leaflet'
export default {
  name: 'Map',
  data () {
    return {
      latitude: '',
      longitude: '',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 20,
      markerLatLng: [],
      mapa: ''
    }
  },
  watch: {
    markerLatLng: function (val) {
      console.log(val)
    }
  },
  created () {
    this.$q.loading.show()
  },
  mounted () {
    this.getGeolocation()
  },
  beforeDestroy () {
    leaflet.map('mapid').remove()
  },
  methods: {
    getGeolocation () {
      if (navigator.geolocation) {
        if (this.mapa === '') {
          navigator.geolocation.getCurrentPosition(
            this.setPosition,
            this.errorPosition
          )
        } else {
          leaflet.map('mapid').remove()
        }
      } else {
        this.errorPosition()
      }
    },
    setPosition (position) {
      this.$q.loading.show()
      const coords = position.coords
      this.markerLatLng = [coords.latitude, coords.longitude]
      try {
        const myMap = leaflet.map('mapid').setView(this.markerLatLng, 19)
        this.mapa = myMap
        leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFmYW9vbGl2ZWlyYSIsImEiOiJja3YwYXBxMG83a3I1MnFuemdpaXV0dTUxIn0.f_wybQ1DSPkAmzsK-fi8og', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 20,
          minZoom: 8,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoicmFmYW9vbGl2ZWlyYSIsImEiOiJja3YwYXBxMG83a3I1MnFuemdpaXV0dTUxIn0.f_wybQ1DSPkAmzsK-fi8og'
        }).addTo(myMap)
        leaflet.marker(this.markerLatLng, { draggable: true }).addTo(myMap)
      } catch (e) {
        console.log('e', e)
        if (e.message !== 'Map container is already initialized.') {
          this.$q.notify({
            position: 'bottom',
            color: 'negative',
            message: 'Não foi possível carregar sua posição'
          })
          this.$router.go()
        }
      } finally {
        this.$q.loading.hide()
      }
    },
    errorPosition () {
      this.$q.notify({
        position: 'top-right',
        color: 'negative',
        textColor: 'white',
        message: 'Não foi possível recuperar sua localização!'
      })
      this.setPosition({ coords: { latitude: -23.5428164, longitude: -46.6416237 } })
    }
  }
}
</script>
