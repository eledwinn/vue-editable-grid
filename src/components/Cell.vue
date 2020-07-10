<template lang="pug">
td.cell(
  :id='`cell${rowIndex}-${columnIndex}`'
  :class='{ selected, editable, invalid, [column.type || "text"]: true }'
  :title='invalid'
  :style='row.$cellStyle && row.$cellStyle[column.field]'
  @click='$emit("click", $event)'
  @dblclick='$emit("dblclick", $event)'
  @contextmenu='$emit("contextmenu", $event)'
)
  span.editable-field(v-if='cellEditing[0] === rowIndex && cellEditing[1] === columnIndex')
    input(
      :type='inputType'
      ref='input'
      @keyup.enter='setEditableValue'
      @keydown.tab='setEditableValue'
      @keyup.esc='editCancelled'
      @focus='editPending = true'
      @blur='leaved'
    )
  span(v-else)
    a(@click.prevent='linkClicked' v-if='column.type === "link"' href='#') {{ row[column.field] | cellFormatter(column, row) }}
    span(v-else) {{ row[column.field] | cellFormatter(column, row) }}
</template>

<script>
import Vue from 'vue'
import { format } from 'date-fns'
import { cellValueParser, sameDates } from './helpers'
import { cellFormatter } from './vue-filters.js'

export default {
  filters: {
    cellFormatter
  },
  props: {
    column: { type: Object },
    row: { type: Object },
    columnIndex: { type: Number },
    rowIndex: { type: Number },
    selStart: { type: Array },
    selEnd: { type: Array },
    cellEditing: { type: Array },
    cellsWithErrors: { type: Object }
  },
  data () {
    return { value: null, rowValue: null, editPending: false }
  },
  computed: {
    selected () {
      return this.rowIndex >= this.selStart[0] && this.rowIndex <= this.selEnd[0] && this.columnIndex >= this.selStart[1] && this.columnIndex <= this.selEnd[1]
    },
    editable () {
      return this.cellEditing[0] === this.rowIndex && this.cellEditing[1] === this.columnIndex
    },
    invalid () {
      return this.cellsWithErrors[`cell${this.rowIndex}-${this.columnIndex}`]
    },
    inputType () {
      switch (this.column.type) {
        case 'text': return 'text'
        case 'link': return 'text'
        case 'numeric': return 'number'
        case 'currency': return 'number'
        case 'percent': return 'number'
        case 'date': return 'date'
        case 'datetime': return 'datetime-local'
      }
      return 'text'
    }
  },
  watch: {
    cellEditing () {
      if (this.cellEditing[0] === this.rowIndex && this.cellEditing[1] === this.columnIndex) {
        this.rowValue = this.getEditableValue(this.row[this.column.field])
        this.value = this.getEditableValue(this.cellEditing[2] || this.row[this.column.field])

        Vue.nextTick(() => {
          const input = this.$refs.input
          if (!this.value && this.value !== 0 && this.value !== false) {
            input.value = null
            input.focus()
            return
          }
          if (this.column.type === 'datetime' || this.column.type === 'date') {
            const formattedDate = this.column.type === 'datetime'
              ? `${format(this.value, 'yyyy-MM-dd')}T${format(this.value, 'HH:mm')}`
              : `${format(this.value, 'yyyy-MM-dd')}`
            setTimeout(() => {
              input.value = formattedDate
              input.focus()
            }, 50)
          } else {
            input.value = this.value
            input.focus()
          }
        })
      }
    }
  },
  methods: {
    getEditableValue (value) {
      if (this.column.type === 'datetime' || this.column.type === 'date') {
        if (typeof value === 'string') {
          const parsedDate = new Date(value)
          return isNaN(parsedDate) ? null : parsedDate
        }
      }
      return value
    },
    setEditableValue ($event) {
      const value = cellValueParser(this.column, this.row, this.$refs.input.value, true)
      this.editPending = false
      let valueChanged = true
      if (value === this.rowValue) valueChanged = false
      else if (value && (this.column.type === 'date' || this.column.type === 'datetime')) {
        if (sameDates(value, this.rowValue)) valueChanged = false
      }
      const { row, column, rowIndex, columnIndex } = this
      this.$emit('edited', { row, column, rowIndex, columnIndex, $event, value, valueChanged })
    },
    editCancelled () {
      this.$emit('edit-cancelled')
    },
    leaved ($event) {
      if (this.editPending) {
        this.setEditableValue($event)
      }
    },
    linkClicked () {
      this.$emit('link-clicked')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './variables';

.cell {
  padding: $cell-updown-paddings $cell-side-paddings;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;

  border: solid 1px transparent;
  border-bottom-color: $cell-border-color;
  border-right-color: $cell-border-color;
  cursor: default;

  &.selected {
    border-color: $cell-selected-border-color;
  }

  &.currency,
  &.numeric,
  &.percent
  {
    text-align: right;
  }

  &.editable {
    padding: 0;
    display: flex;
    box-shadow: 1px 1px 4px #cbcbcb;
  }

  &.invalid {
    &::after {
      content: "\26A0";
      position: absolute;
      right: 6px;
      top: 0;
      color: red;
      font-weight: bold;
      font-size: 20px;
    }
  }

  .editable-field {
    height: 100%;
    width: 100%;
    display: flex;

    input {
      height: 100%;
      border: none;
      outline: none;
      width: 100%;

      &:disabled {
        background: #eeeeee;
        cursor: not-allowed;
      }
    }
  }
}
</style>
