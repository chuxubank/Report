const app = require('./scripts/app')

// If Debug
$clipboard.texts = [
  $file.read("./files/Report_2020_12_21.txt").string,
  $file.read("./files/Report_2020_12_22.txt").string
]
app.init()