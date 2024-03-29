<template>
  <div id="app">
    <vue-editable-grid
      class="grid"
      ref="grid"
      id="mygrid"
      :column-defs="columnDefs"
      :row-data="rows"
      row-data-key='id'
      @cell-updated="cellUpdated"
      @row-selected="rowSelected"
      @multiple-selected='multipleSelected'
      @link-clicked="linkClicked"
      @context-menu="contextMenu"
      @filtered-data-changed="filteredDataChanged"
    >
      <template v-slot:header>
        Vue editable grid, by eledwinn. {{ filteredRows ? filteredRows.length : rows.length }} rows.
        <a href="#" @click.prevent="removeCurrentRow" v-if="selectedRow" class="ml-1">Remove current row</a>
      </template>
      <template v-slot:header-r>
        Total rows: {{ rows.length }}
      </template>
    </vue-editable-grid>
  </div>
</template>

<script>
import VueEditableGrid from './components/VueEditableGrid.vue'

import data from './data'

export const defaultDateFormat = 'MMM dd, yyyy'
export const defaultDateTimeFormat = 'MMM dd, yyyy h:mm a'

const numericFormatter = event => {
  if (event.reverse) {
    return event.value && +event.value.replace(' years')
  }
  return `${event.value} years`
}
const selectOptions = [
  { value: '', text: 'Select' },
  { value: 'green', text: 'green' },
  { value: 'blue', text: 'blue' },
  { value: 'brown', text: 'brown' }
]
const columnDefinition = [
  { sortable: true, filter: true, field: 'id', headerName: 'Id', editable: true },
  { sortable: true, filter: true, field: 'eyeColor', headerName: 'Eye color', editable: true, type: 'select', selectOptions: selectOptions },
  { sortable: true, filter: true, field: 'name', headerName: 'Name', editable: true, maxlength: 5, className: 'my-custom-class' },
  { sortable: true, filter: true, field: 'gender', headerName: 'gender', editable: true },
  { sortable: true, filter: true, field: 'company', headerName: 'Company', editable: true },
  { sortable: true, filter: true, field: 'email', headerName: 'Email', editable: true },
  { sortable: true, filter: true, field: 'Phone', headerName: 'Phone', editable: true },
  { sortable: true, filter: true, field: 'registered', headerName: 'registered', type: 'datetime', format: defaultDateTimeFormat, editable: true },
  { sortable: true, filter: true, field: 'registered', headerName: 'registered', type: 'date', format: defaultDateTimeFormat, editable: true, min: '2020-12-01', max: '2021-01-15' },
  { sortable: true, filter: true, field: 'age', headerName: 'Age', type: 'numeric', editable: true, min: 1, max: 100 },
  { sortable: true, filter: true, field: 'age', headerName: 'Age Formatted', type: 'numeric', editable: true, formatter: numericFormatter },
  { sortable: true, filter: true, field: 'balance', headerName: 'Balance', type: 'currency', editable: true },
  { sortable: true, filter: true, field: 'happiness', headerName: 'Happiness percent', type: 'percent', editable: true },
  { sortable: true, filter: true, field: 'isActive', headerName: 'Is active', type: 'boolean', editable: true },
  { sortable: true, filter: false, field: 'picture', headerName: 'Picture', type: 'link', editable: false }
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
      selectedRow: null,
      filteredRows: null
    }
  },
  created () {
    this.formatData()
  },
  mounted () {
    // you can call methods this.$refs.grid.getFormattedRows()
  },
  methods: {
    formatData () {
      data.forEach(row => {
        this.formatRow(row)
      })
      this.rows = data
    },
    formatRow (row) {
      const red = '#ffe5e5'
      const green = '#b6f7b6'
      const { happiness } = row
      const priceRateBgColor = happiness > 0.6 ? green : red
      row.$cellStyle = {
        happiness: priceRateBgColor && { backgroundColor: priceRateBgColor }
      }
      if (row.eyeColor === 'blue') {
        row.$rowStyle = { color: 'blue' }
      }
    },
    cellUpdated ($event) {
      console.log($event)
    },
    rowSelected ($event) {
      this.selectedRow = $event.rowData
    },
    multipleSelected ($event) {
      console.log('Multiple selected', $event)
    },
    linkClicked ($event) {
      console.log($event)
    },
    removeCurrentRow () {
      this.rows = this.rows.filter(row => row.id !== this.selectedRow.id)
    },
    contextMenu ($event) {
      console.log($event)
    },
    filteredDataChanged (filteredRows) {
      console.log(this.$refs.grid.rowDataFiltered)
      this.filteredRows = filteredRows
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
  font-size: 14px;
  height: 400px;
}

.grid {
  height: 100%;
}

.ml-1 {
  margin-left: 10px;
}

.my-custom-class
.header-content{
  color: red;

  &::before {
    content: '*';
  }
}
</style>
