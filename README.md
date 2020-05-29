# vue-editable-grid

## How to install

```
npm install vue-editable-grid vue-currency-filter @vuejs-community/vue-filter-date-format
```

Then import in you main file

```js
import Vue from 'vue'

// external dependencies
import VueCurrencyFilter from 'vue-currency-filter'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
// Vue editable grid component and styles
import VueEditableGrid from 'vue-editable-grid'
import 'vue-editable-grid/dist/VueEditableGrid.css'

// external dependencies
Vue.use(VueFilterDateFormat)
Vue.use(VueCurrencyFilter)

// register component in the Vue app
Vue.component('vue-editable-grid', VueEditableGrid)
```

Now you can use it
```html
<vue-editable-grid
  class="grid"
  :column-defs="columnDefs"
  :row-data="shipmentsFiltered"
  :pageCount='0'
  :displays='gridDisplays'
  @cell-updated="cellUpdated"
  @row-selected="rowSelected"
></vue-editable-grid>
```
Column definition format:
```js
const columnDefs = [
  { sortable: true, filter: true, field: 'shipmentId', headerName: 'Id' },
  { sortable: true, filter: true, field: 'datePublication', headerName: 'Date Publication', type: 'datetime', format: 'M-YYYY' },
  { sortable: true, filter: true, field: 'typeTruckDescription', headerName: 'Truck' },
  { sortable: true, filter: true, field: 'countryName', headerName: 'Cuty' },
  { sortable: true, filter: true, field: 'ammount', headerName: 'Ammount', type: 'currency' }
]
```


## Column definition reference

### sortable
If column can be sort

default: false

### filter
If column can be filter

default: false

### field
TODO ...

### headerName
TODO ...

### type
TODO ...

### format
TODO ...

## How to colaborate
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
