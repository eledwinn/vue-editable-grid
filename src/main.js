import Vue from 'vue'
import App from './App.vue'
import VueCurrencyFilter from 'vue-currency-filter'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'

Vue.config.productionTip = false

Vue.use(VueFilterDateFormat)
Vue.use(VueCurrencyFilter, {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true
})

new Vue({
  render: h => h(App)
}).$mount('#app')
