<template>
  <div id="app">
    <vue-editable-grid
      class="grid"
      :column-defs="columnDefs"
      :row-data="rows"
      :pageCount='0'
      :displays="gridDisplays"
      @cell-updated="cellUpdated"
    ></vue-editable-grid>
  </div>
</template>

<script>
import VueEditableGrid from './components/VueEditableGrid.vue'

import data from './data'

export const defaultDateFormat = 'MMM dd, yyyy'
export const defaultDateTimeFormat = 'MMM dd, yyyy h:mm a'

const columnDefinition = [
  { sortable: true, filter: true, field: 'shipmentId', headerName: 'Id', editable: true },
  { sortable: true, filter: true, field: 'typeTruckDescription', headerName: 'Truck', editable: true },
  { sortable: true, filter: true, field: 'oriCityCode', headerName: 'Origin City', editable: true },
  { sortable: true, filter: true, field: 'desCityCode', headerName: 'Dest City', editable: true },
  { sortable: true, filter: true, field: 'weightLoad', headerName: 'Weight', editable: true },
  { sortable: true, filter: true, field: 'purchaseOrder', headerName: 'PO', editable: true },
  { sortable: true, filter: true, field: 'carrierName', headerName: 'Carrier name', editable: true },
  { sortable: true, filter: true, field: 'comment1', headerName: 'Comment 1', editable: true },
  { sortable: true, filter: true, field: 'comment2', headerName: 'Comment 2', editable: true },
  { sortable: true, filter: true, field: 'dateLastUpdateDat', headerName: 'Date time', type: 'datetime', format: defaultDateTimeFormat, editable: true },
  { sortable: true, filter: true, field: 'priceDatAvg', headerName: 'Numeric', type: 'numeric', editable: true },
  { sortable: true, filter: true, field: 'priceDatAvg', headerName: 'Currency', type: 'currency', editable: true },
  { sortable: true, filter: true, field: 'dateLastUpdateDat', headerName: 'Date', type: 'date', format: defaultDateFormat, editable: true },
  { sortable: true, filter: true, field: 'isActive', headerName: 'Is active', type: 'boolean', editable: true }
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
    },
    cellUpdated ($event) {
      console.log($event)
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
