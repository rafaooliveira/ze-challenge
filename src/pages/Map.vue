<template lang="pug">
div
  q-btn(
    label="Voltar para home"
    icon="arrow_back"
    flat
    @click="backHome"
  )
  div(id="mapid")
    q-btn#refreshButton.bgYellowZe(
      label="Confirmar local"
      filled
      rounded
      @click="openModal(true)"
    )
</template>

<style>
#mapid {
  height: 100vh;
  z-index: 0;
}
#refreshButton {
  position: absolute;
  bottom: 15vh;
  left: 90vh;
  padding: 10px;
  z-index: 4000;
  color: #000;
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
      mapa: '',
      positionLocal: null,
      token: 'pk.eyJ1IjoicmFmYW9vbGl2ZWlyYSIsImEiOiJja3YwYXBxMG83a3I1MnFuemdpaXV0dTUxIn0.f_wybQ1DSPkAmzsK-fi8og'
    }
  },
  watch: {
    latitude: function (val) {
      console.log('lat', val)
    },
    longitude: function (val) {
      console.log('lng', val)
    }
  },
  created () {
    this.$q.loading.show()
  },
  async mounted () {
    this.getGeolocation()
  },
  beforeDestroy () {
    leaflet.map('mapid').remove()
  },
  methods: {
    backHome () {
      this.$router.push('/')
    },
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
      this.latitude = coords.latitude
      this.longitude = coords.longitude
      try {
        const myMap = leaflet.map('mapid').setView(this.markerLatLng, 16)
        this.mapa = myMap
        leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${this.token}`, {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 20,
          minZoom: 8,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: `${this.token}`
        }).addTo(myMap)
        this.markerLatLng = leaflet.marker(this.markerLatLng).addTo(myMap).bindPopup(`
          <strong><center> Essa é a sua posição atual </center></strong>
       `).openPopup()
      } catch (e) {
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
    },
    async openModal () {
      try {
        const response = this.$axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/Brasil.json?proximity=${this.latitude},${this.longitude}&access_token=${this.token}`)
        console.log(response)
      } catch {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao encontrar endereço'
        })
      }
    }
  }
}
</script>
