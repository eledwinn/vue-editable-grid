let pageInitialPosition
let headerInitialWidth
let onChangesCallback
let onFinishCallback
let tableHead

export const initResize = (header, $event, onChanges, onFinish) => {
  pageInitialPosition = $event.clientX
  headerInitialWidth = header.offsetWidth
  onChangesCallback = onChanges
  onFinishCallback = onFinish
  tableHead = header.parentNode.parentNode
  tableHead.classList.add('resizing')
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = e => {
  requestAnimationFrame(() => {
    const newWIdth = headerInitialWidth + (e.clientX - pageInitialPosition)
    onChangesCallback(newWIdth)
  })
}

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  tableHead.classList.remove('resizing')
  onFinishCallback()
}
