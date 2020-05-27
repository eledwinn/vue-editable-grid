<template>
  <div id="app">
    <vue-editable-grid
      class="grid"
      :column-defs="columnDefs"
      :row-data="rows"
      :pageCount='0'
      :displays="gridDisplays"
    ></vue-editable-grid>
  </div>
</template>

<script>
import VueEditableGrid from './components/VueEditableGrid.vue'

import data from './data'

export const defaultDateFormat = 'MMM DD, YYYY'
export const defaultDateTimeFormat = 'MMM DD, YYYY h:mm a'

const columnDefinition = [
  { sortable: true, filter: true, field: 'shipmentId', headerName: 'Id', checkboxSelection: true },
  { sortable: true, filter: true, field: 'datePublication', headerName: 'Date Publication', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'typeTruckDescription', headerName: 'Truck' },
  { sortable: true, filter: true, field: 'oriCityCode', headerName: 'Origin City' },
  { sortable: true, filter: true, field: 'desCityCode', headerName: 'Dest City' },
  { sortable: true, filter: true, field: 'priceRate', headerName: 'Price Rate', type: 'currency' },
  { sortable: true, filter: true, field: 'weightLoad', headerName: 'Weight' },
  { sortable: true, filter: true, field: 'purchaseOrder', headerName: 'PO', editable: true },
  { sortable: true, filter: true, field: 'carrierName', headerName: 'Carrier name' },
  { sortable: true, filter: true, field: 'comment1', headerName: 'Comment 1' },
  { sortable: true, filter: true, field: 'comment2', headerName: 'Comment 2' },
  { sortable: true, filter: true, field: 'dateLastUpdateDat', headerName: 'Date last update dat', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'statusLoadDatDescription', headerName: 'Status load' },
  { sortable: true, filter: true, field: 'priceDatMin', headerName: 'Price Dat Min', type: 'currency' },
  { sortable: true, filter: true, field: 'priceDatAvg', headerName: 'Price Dat Avg', type: 'currency' },
  { sortable: true, filter: true, field: 'priceDatMax', headerName: 'Price Dat Max', type: 'currency' },
  { sortable: true, filter: true, field: 'priceDatOil', headerName: 'Price Dat Oil', type: 'currency' },
  { sortable: true, filter: true, field: 'milesDat', headerName: 'Miles Dat' },
  { sortable: true, filter: true, field: 'milesGoogle', headerName: 'Miles Google' },
  { sortable: true, filter: true, field: 'priceDifferenceMin', headerName: 'Price Difference Min', type: 'currency' },
  { sortable: true, filter: true, field: 'priceDifferenceAvg', headerName: 'Price Difference Avg', type: 'currency' },
  { sortable: true, filter: true, field: 'priceDifferenceMax', headerName: 'Price Difference Max', type: 'currency' },
  { sortable: true, filter: true, field: 'dateNegotiation', headerName: 'Date Negotiation', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'dateCancelled', headerName: 'DateCancelled', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'reasonForCancellationId', headerName: 'Reason for Cancellation' },
  { sortable: true, filter: true, field: 'dateDepartureEstimated', headerName: 'Date departure estimated', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'dateDepartureRequested', headerName: 'Date departure requested', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'dateDepartureActual', headerName: 'Date departure actual', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'dateDeliveryEstimated', headerName: 'Date delivery estimated', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'dateDeliveryActual', headerName: 'Date delivery actual', type: 'datetime', format: defaultDateTimeFormat },
  { sortable: true, filter: true, field: 'isActive', headerName: 'Is active', type: 'boolean' }
]

export default {
  name: 'App',
  components: {
    VueEditableGrid
  },
  data () {
    return {
      columnDefs: columnDefinition,
      rows: [],
      gridDisplays: ['Say: hello']
    }
  },
  created () {
    this.filterShipments()
  },
  methods: {
    filterShipments () {
      const datetimeColumns = this.columnDefs.filter(col => col.type === 'datetime')
      const map = shipment => {
        datetimeColumns.forEach(column => {
          shipment[column.field] = shipment[column.field] && new Date(shipment[column.field])
        })
        return shipment
      }
      this.rows = data.map(row => map(row))
      this.formatShipments()
    },
    formatShipments () {
      this.rows.forEach(shipment => {
        this.formatShipment(shipment)
      })
    },
    formatShipment (shipment) {
      const red = '#ffe5e5'
      const green = '#b6f7b6'
      const { poStatusId, priceRate, priceDatAvg } = shipment
      const priceRateBgColor = !priceRate ? null : priceRate < priceDatAvg ? green : priceRate > priceDatAvg ? red : null
      const purchaseOrderBgColor = poStatusId === 2 && red
      shipment.$cellStyle = {
        purchaseOrder: purchaseOrderBgColor && { backgroundColor: purchaseOrderBgColor },
        priceRate: priceRateBgColor && { backgroundColor: priceRateBgColor }
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 14px;
  height: 400px;
}

.grid {
  height: 100%;
}
</style>
