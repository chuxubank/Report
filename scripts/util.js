function isToday(str) {
  return (new Date().toDateString() === new Date(str).toDateString())
}

function formatDate(date) {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function sum(ob1, ob2) {
  let sum = {}

  Object.keys(ob1).forEach(key => {
    if (ob2.hasOwnProperty(key)) {
      sum[key] = ob1[key] + ob2[key]
    }
  })
  return sum
}