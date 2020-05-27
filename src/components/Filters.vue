<template lang="pug">
  .grid-filters
    button.filter.remove(@click='remove()' v-if='filtersLength') x
    button.filter(v-for='field in fieldsWithData' :key='field' @click='remove(field)') {{ colNames[field] }}: {{ filters[field] }}
</template>

<script>
export default {
  props: {
    filters: { type: Object },
    columnDefs: { type: Array }
  },
  computed: {
    colNames () {
      return this.columnDefs.reduce((memo, column) => {
        memo[column.field] = column.headerName
        return memo
      }, {})
    },
    filtersLength () {
      return this.fieldsWithData.length
    },
    fieldsWithData () {
      return Object.keys(this.filters).filter(field => this.filters[field])
    }
  },
  methods: {
    remove (field) {
      this.$emit('remove', field)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  padding: 0;
}

.filter {
  border: solid 1px #dadada;
  padding: 2px 10px;
  border-radius: 12px;
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
}
</style>
