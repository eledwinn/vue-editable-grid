import { cellFormatter } from './vue-filters'

const rawComparerColumns = ['datetime', 'date', 'boolean']

const applyFilter = (rowValue, filterValue) => {
  const [, negativeVal] = filterValue.split('!')
  return negativeVal
    ? (negativeVal && rowValue.indexOf(negativeVal.trim().toLowerCase()) < 0)
    : filterValue && rowValue.indexOf(filterValue.trim().toLowerCase()) >= 0
}

export default (filter, data, columnDefs, sortBy, sortDesc) => {
  const filterKeys = Object.keys(filter)
  const columns = columnDefs.reduce((previous, column) => {
    previous[column.field] = column
    return previous
  }, {})
  const filtered = data.filter(row => {
    return filterKeys.filter(filterKey => {
      const filterQuery = filter[filterKey]
      if (!filterQuery) {
        return true
      }
      const column = columns[filterKey]
      const rowValue = rawComparerColumns.indexOf(column.type) >= 0 ? `${cellFormatter(row[filterKey], column)}`.toLowerCase() : `${row[filterKey]}`.toLowerCase()
      if (filterQuery.indexOf('&') >= 0) {
        const filterValues = filterQuery.split('&')
        return filterValues.filter(filterValue => applyFilter(rowValue, filterValue)).length === filterValues.length
      } else {
        const filterValues = filterQuery.split(',')
        return filterValues.some(filterValue => applyFilter(rowValue, filterValue))
      }
    }).length === filterKeys.length
  })
  return filtered.sort((a, b) => {
    const valA = a[sortBy]
    const valB = b[sortBy]
    if (valA > valB) {
      return sortDesc ? -1 : 1
    }
    if (valA < valB) {
      return sortDesc ? 1 : -1
    }
    return 0
  })
}
