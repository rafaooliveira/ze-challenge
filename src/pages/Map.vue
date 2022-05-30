<template>
<div>
  <div id="mapid" :key="markersLocal"/>
</div>
</template>

<style>
#mapid {
  height: 75vh;
}
</style>
<script>
import leaflet from 'leaflet'
export default {
  props: {
    markers: {
      type: Array,
      default: () => {
        return []
      }
    },
    listaPronta: Boolean
  },
  name: 'PageMaps',
  data () {
    return {
      latitude: '',
      longitude: '',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 20,
      center: [],
      markerLatLng: [],
      eventoLatLng: [],
      markersLocal: [],
      ready: false,
      mapa: ''
    }
  },
  created () {
    this.markersLocal = this.markers
    this.$q.loading.show()
  },
  mounted () {
    if (this.listaPronta) {
      this.getGeolocation()
    }
  },
  computed: {
    markersReady: function () {
      if (this.eventoLatLng.length === this.markers.length && this.listaPronta && this.markers.length) {
        return true
      }
      return false
    }
  },
  methods: {
    getGeolocation () {
      if (navigator.geolocation) {
        if (this.listaPronta) {
          if (this.mapa === '' && !this.markersReady && !this.ready) {
            navigator.geolocation.getCurrentPosition(
              this.setPosition,
              this.errorPosition
            )
          } else {
            leaflet.map('mapid').remove()
          }
        }
      } else {
        console.log('ele percebeu que não tem autorização')
        this.errorPosition()
      }
    },
    setPosition (position) {
      this.eventoLatLng = []
      this.$q.loading.show()
      const coords = position.coords
      this.center = [coords.latitude, coords.longitude]
      this.markerLatLng = [coords.latitude, coords.longitude]
      try {
        const myMap = leaflet.map('mapid').setView([this.markerLatLng[0], this.markerLatLng[1]], 17)
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
        if (this.markers.length) {
          this.markersLocal.forEach((i) => {
            this.eventoLatLng.push({
              lat: i.coords.latitude,
              log: i.coords.longitude,
              info: i.dados.nome,
              address: i.dados.enderecoCompleto,
              dtEvento: i.dados.dtEvento,
              hrEvento: i.dados.hrEvento,
              tipoEvento: i.dados.tipoEvento,
              descricao: i.dados.descricao
            })
          })
          this.eventoLatLng.forEach((el) => {
            leaflet
              .marker([el.lat, el.log], { icon: this.getMarkerIcon(el.tipoEvento) })
              .addTo(myMap)
              .bindPopup(`
                <strong><center> ${el.info} </center></strong>
                <center> ${el.descricao} </center> <br>
                <strong> Tipo do evento: </strong> ${el.tipoEvento} <br>
                <strong> Data e hora do evento: </strong> ${el.dtEvento} às ${el.hrEvento} <br>
                <strong> Local: </strong> ${el.address} <br>
              `)
          })
          this.ready = true
        }
      } catch (e) {
        if (e.message !== 'Map container is already initialized.') {
          this.$q.notify({
            position: 'bottom',
            color: 'negative',
            message: 'Não foi possível carregar os eventos'
          })
          // this.$router.go()
        }
        this.ready = false
      } finally {
        this.$q.loading.hide()
      }
    },
    getMarkerIcon (tipoEvento) {
      // seta originalmente como roxo (cor da categoria outros)
      let imgUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
      if (tipoEvento === 'Dança') {
        imgUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
      } else {
        if (tipoEvento === 'Oficina de Grafite') {
          imgUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
        } else {
          if (tipoEvento === 'Batalha de rima') {
            imgUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
          }
        }
      }
      return new leaflet.Icon({
        iconUrl: imgUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    },
    errorPosition () {
      this.$q.notify({
        position: 'bottom',
        timeout: 3000,
        color: 'negative',
        textColor: 'white',
        message: 'Não foi possível recuperar sua localização!'
      })
      this.setPosition({ coords: { latitude: -23.5428164, longitude: -46.6416237 } })
    }
  }
}
</script>
