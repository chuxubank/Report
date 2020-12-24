const Report = require("./report")
$include("./util")

exports.init = async () => {

  $ui.render({
    props: {
      title: "报表",
      navButtons: [
        {
          symbol: "doc.text",
          handler: generateReport
        },
        {
          symbol: "square.and.arrow.down",
          handler: importReports
        }
      ]
    },
    events: {
      appeared: importReports
    },
    views: [
      {
        type: "stack",
        props: {
          spacing: $stackViewSpacing.useSystem,
          distribution: $stackViewDistribution.fillEqually,
          stack: {
            views: [
              {
                type: "text",
                props: {
                  placeholder: "昨日报表",
                  id: "yesterday",
                  cornerRadius: 8,
                  smoothCorners: 8,
                  borderWidth: 1,
                  borderColor: $color("tint")
                }
              },
              {
                type: "text",
                props: {
                  placeholder: "今日报表",
                  id: "today",
                  cornerRadius: 8,
                  smoothCorners: 8,
                  borderWidth: 1,
                  borderColor: $color("tint")
                }
              }]
          }
        },
        layout: function (make, view) {
          make.edges.equalTo(0)
        }
      }
    ]
  })

}

function importReports() {
  let reports = [$cache.get("report"), $clipboard.text]
  console.log(reports)
  reports.forEach(input => {
    let matchs = input?.match(Report.dateRegExp)
    if (matchs?.length == 4) {
      let date = new Date(Date.parse(`${matchs[1]}-${matchs[2]}-${matchs[3]}`))
      if (isToday(date)) {
        $("today").text = input
      }
      else {
        $("yesterday").text = input
      }
    }
  })
}

function generateReport() {
  try {
    let yesterdayReport = new Report()
    yesterdayReport.prase($("yesterday").text)
    let todayReport = new Report()
    todayReport.prase($("today").text)
    if (todayReport.date.getDay() == 1) {
      yesterdayReport.clearWeek()
    }
    if (todayReport.date.getDate() == 1) {
      yesterdayReport.clearWeek()
      yesterdayReport.clearMonth()
    }
    if (todayReport.date.getMonth() == 0) {
      yesterdayReport.clearWeek()
      yesterdayReport.clearMonth()
      yesterdayReport.clearYear()
    }
    todayReport.phoneCallMonthly = yesterdayReport.phoneCallMonthly + todayReport.phoneCallDaily
    todayReport.visitMonthly = yesterdayReport.visitMonthly + todayReport.visitDaily
    todayReport.signWeekly = sum(yesterdayReport.signWeekly, todayReport.signDaily)
    todayReport.signMonthly = sum(yesterdayReport.signMonthly, todayReport.signDaily)
    todayReport.signYearly = sum(yesterdayReport.signYearly, todayReport.signDaily)
    todayReport.paybackWeekly = yesterdayReport.paybackWeekly + todayReport.paybackDaily
    todayReport.paybackMonthly = yesterdayReport.paybackMonthly + todayReport.paybackDaily
    todayReport.paybackYearly = yesterdayReport.paybackYearly + todayReport.paybackDaily
    todayReport.allNotPayback = todayReport.signDaily.amount - todayReport.paybackDaily + yesterdayReport.allNotPayback
    report = todayReport.generate()
    $clipboard.text = report
    $("today").text = report
    $cache.set("report", report)
    $ui.success("今日报表已生成, 并已复制到剪贴板！")
    shareReport()
    console.log(report)
  } catch (error) {
    $ui.error("生成失败！")
    console.error(error)
  }
}

function shareReport() {
  $share.sheet({
    items: [
      {
        "name": formatDate(new Date()) + "报表.txt",
        "data": $("today").text
      }
    ],
    handler: function (success) {
    }
  })
}