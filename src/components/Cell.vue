<template lang="pug">
td.cell(
  :id='`cell${rowIndex}-${columnIndex}`'
  :class='{ selected, editable, invalid, [column.type || "text"]: true }'
  :title='invalid'
  :style='row.$cellStyle && row.$cellStyle[column.field]'
  @click='$emit("click", $event)'
  @dblclick='$emit("dblclick", $event)'
)
  div.editable-field(v-if='cellEditing[0] === rowIndex && cellEditing[1] === columnIndex')
    input(
      type='text'
      v-model='value'
      @keyup.enter='setEditableValue'
      @keydown.tab='setEditableValue'
      @keyup.esc='editCancelled'
      @focus='editPending = true'
      @blur='leaved'
    )
  div(v-else)
    span(v-if='!row[column.field] && row[column.field] !== 0')
    span(v-else-if='column.type === "currency"') {{ row[column.field] | currency }}
    span(v-else-if='column.type === "date"') {{ row[column.field] | dateFormat(column.format || 'YYYY-MM-DD') }}
    span(v-else-if='column.type === "datetime"') {{ row[column.field] | dateFormat(column.format || 'YYYY-MM-DD HH:mm:ss') }}
    span(v-else-if='column.type === "boolean"') {{ row[column.field] ? 'Y' : 'N' }}
    span(v-else) {{ row[column.field] }}
</template>

<script>
import Vue from 'vue'

export default {
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
    return { value: null, editPending: false }
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
    }
  },
  watch: {
    cellEditing () {
      if (this.cellEditing[0] === this.rowIndex && this.cellEditing[1] === this.columnIndex) {
        this.value = this.cellEditing[3] ? null : this.row[this.column.field]
        Vue.nextTick(() => {
          document.querySelector(`#cell${this.rowIndex}-${this.columnIndex} input`).focus()
        })
      }
    }
  },
  methods: {
    setEditableValue ($event) {
      const { row, column, rowIndex, columnIndex, value } = this
      this.editPending = false
      this.$emit('edited', { row, column, rowIndex, columnIndex, $event, value })
    },
    editCancelled () {
      this.$emit('edit-cancelled')
    },
    leaved ($event) {
      if (this.editPending) {
        this.setEditableValue($event)
      }
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

  &.currency {
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
