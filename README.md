# vue-editable-grid

## How to install

```
npm install vue-editable-grid
```

Then import in you main file

```js
import Vue from 'vue'

// Vue editable grid component and styles
import VueEditableGrid from 'vue-editable-grid'
import 'vue-editable-grid/dist/VueEditableGrid.css'

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
  { sortable: true, filter: true, field: 'datePublication', headerName: 'Date Publication', type: 'datetime', format: 'MMM dd, yyyy' },
  { sortable: true, filter: true, field: 'typeTruckDescription', headerName: 'Truck' },
  { sortable: true, filter: true, field: 'countryName', headerName: 'Cuty' },
  { sortable: true, filter: true, field: 'ammount', headerName: 'Ammount', type: 'currency' }
]
```

## Properties

TODO: ...

## Column definition reference

### sortable
If column can be sort

Default: `false`

### filter
If column can be filter

Default: `false`

### field
Key name for column in `row-data` items

### headerName
Name for column header

### type
Data type, possible vales: `datetime`, `date`, `text`, `numeric`, `currency`, `boolean`.

Default: `text`

### format
Data column format, only apply for `date` and `datetime` column types.

Refer to [date-fns format table](https://date-fns.org/v2.14.0/docs/format) for more details.

### editable
Allow to edit column values.

Default: `false`

## Events

### cell-updated
Emited when cell value is changed.
TODO: ...

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
