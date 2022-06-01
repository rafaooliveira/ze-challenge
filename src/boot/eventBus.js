import mitt from 'mitt'
const emitter = mitt()
import Vue from 'vue'

Vue.prototype.emitter = emitter
