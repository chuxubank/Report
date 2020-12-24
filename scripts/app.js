exports.init = async () => {

  $ui.render({
    props: {
      title: "报表",
      navButtons: [
        {
          symbol: "square.and.arrow.up",
          handler: shareReport
        },
        {
          symbol: "doc.text",
          handler: generateReport
        }
      ]
    },
    events: {
      appeared: importClipboard,
      disappeared: function () {

      },
      dealloc: function () {

      }
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

function importClipboard() {
  let input = $clipboard.texts
  console.log($l10n("REPORT_2020_12_22"))
}

function generateReport() {
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
  todayReport.visitMonthly = sum(yesterdayReport.visitMonthly, todayReport.visitDaily)
  todayReport.signWeekly = sum(yesterdayReport.signWeekly, todayReport.signDaily)
  todayReport.signMonthly = sum(yesterdayReport.signMonthly, todayReport.signDaily)
  todayReport.signYearly = sum(yesterdayReport.signYearly, todayReport.signDaily)
  todayReport.paybackWeekly = yesterdayReport.paybackWeekly + todayReport.paybackDaily
  todayReport.paybackMonthly = yesterdayReport.paybackMonthly + todayReport.paybackDaily
  todayReport.paybackYearly = yesterdayReport.paybackYearly + todayReport.paybackDaily
  todayReport.allNotPayback = todayReport.signDaily.amount - todayReport.paybackDaily + yesterdayReport.allNotPayback
  let report = todayReport.generate()
  $ui.toast("今日报表已生成")
  console.log(report)
}

function shareReport() {
  $share.sheet({
    items: [
      {
        "name": todayReport.formatDate + "报表.txt",
        "data": report
      }
    ],
    handler: function (success) {
    }
  })
}

// Util
function sum(ob1, ob2) {
  let sum = {}

  Object.keys(ob1).forEach(key => {
    if (ob2.hasOwnProperty(key)) {
      sum[key] = ob1[key] + ob2[key]
    }
  })
  return sum
}

// Report
class Report {
  date = new Date()
  phoneCallDaily = 0
  phoneCallMonthly = 0
  visitDaily = { group: 0, amount: 0 }
  visitMonthly = { group: 0, amount: 0 }
  signDaily = { group: 0, amount: 0.0 }
  signWeekly = { group: 0, amount: 0.0 }
  signMonthly = { group: 0, amount: 0.0 }
  signYearly = { group: 0, amount: 0.0 }
  paybackDaily = 0.0
  paybackWeekly = 0.0
  paybackMonthly = 0.0
  paybackYearly = 0.0
  allNotPayback = 0.0

  get formatDate() {
    return this.date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  prase(input) {
    this.date = Date.parse(input.match(Report.dateRegExp)[1])
    this.phoneCallDaily = parseInt(input.match(Report.phoneCallDailyRegExp)[1])
    this.phoneCallMonthly = parseInt(input.match(Report.phoneCallMonthlyRegExp)[1])
    this.visitDaily.group = parseInt(input.match(Report.visitDailyRegExp)[1])
    this.visitDaily.amount = parseInt(input.match(Report.visitDailyRegExp)[2])
    this.visitMonthly.group = parseInt(input.match(Report.visitMonthlyRegExp)[1])
    this.visitMonthly.amount = parseInt(input.match(Report.visitMonthlyRegExp)[2])
    this.signDaily.group = parseInt(input.match(Report.signDailyRegExp)[1])
    this.signDaily.amount = parseFloat(input.match(Report.signDailyRegExp)[2])
    this.signWeekly.group = parseInt(input.match(Report.signWeeklyRegExp)[1])
    this.signWeekly.amount = parseFloat(input.match(Report.signWeeklyRegExp)[2])
    this.signMonthly.group = parseInt(input.match(Report.signMonthlyRegExp)[1])
    this.signMonthly.amount = parseFloat(input.match(Report.signMonthlyRegExp)[2])
    this.signYearly.group = parseInt(input.match(Report.signYearlyRegExp)[1])
    this.signYearly.amount = parseFloat(input.match(Report.signYearlyRegExp)[2])
    this.paybackDaily = parseFloat(input.match(Report.paybackDailyRegExp)[1])
    this.paybackWeekly = parseFloat(input.match(Report.paybackWeeklyRegExp)[1])
    this.paybackMonthly = parseFloat(input.match(Report.paybackMonthlyRegExp)[1])
    this.paybackYearly = parseFloat(input.match(Report.paybackYearlyRegExp)[1])
    this.allNotPayback = parseFloat(input.match(Report.allNotPaybackRegExp)[1])
  }

  clearYear() {
    this.paybackYearly = 0
    this.signYearly.amount = 0
    this.signYearly.group = 0
  }

  clearMonth() {
    this.signMonthly.amount = 0
    this.signMonthly.group = 0
    this.visitMonthly.amount = 0
    this.visitMonthly.group = 0
    this.paybackMonthly = 0
  }

  clearWeek() {
    this.signWeekly.amount = 0
    this.signWeekly.group = 0
    this.paybackWeekly = 0
  }

  generate() {
    return `${this.formatDate}，青浦新城一站项目销售日报

【来电情况】
今日来电：${this.phoneCallDaily}组
月累计：${this.phoneCallMonthly}组

【来访情况】
今日来访：${this.visitDaily.group}组${this.visitDaily.amount}人
月累计来访：${this.visitMonthly.group}组${this.visitMonthly.amount}人

【签约回款情况】
今日住宅签约：${this.signDaily.group}套，${this.signDaily.amount.toFixed(2)}万元
今日回款金额：${this.paybackDaily.toFixed(2)}万元

本周住宅签约：${this.signWeekly.group}套
本周回款金额：${this.paybackWeekly.toFixed(2)}万元

月累计住宅签约：${this.signMonthly.group}套
月累计签约总金额：${this.signMonthly.amount.toFixed(2)}万元
月累计回款总金额：${this.paybackMonthly}万元

年度累计住宅签约：${this.signYearly.group}套
年度累计签约总金额：${this.signYearly.amount.toFixed(2)}万元
年度累计回款总金额：${this.paybackYearly.toFixed(2)}万元

【已签未回款情况】
历年和本年已签未回款金额：${this.allNotPayback.toFixed(2)}万元`
  }
}

Report.dateRegExp = /^(.*)，青浦新城一站项目销售日报/
Report.phoneCallDailyRegExp = /今日来电：(\d+)组/
Report.phoneCallMonthlyRegExp = /月累计：(\d+)组/
Report.visitDailyRegExp = /今日来访：(\d+)组(\d+)人/
Report.visitMonthlyRegExp = /月累计来访：(\d+)组(\d+)人/
Report.signDailyRegExp = /今日住宅签约：(\d+)套，(\d+[.]?\d*)万元/
Report.signWeeklyRegExp = /本周住宅签约：(\d+)套/
Report.signMonthlyRegExp = /月累计住宅签约：(\d+)套\s+月累计签约总金额：(\d+[.]?\d*)万元/
Report.signYearlyRegExp = /年度累计住宅签约[:：](\d+)套\s+年度累计签约总金额：(\d+[.]?\d*)万元/
Report.paybackDailyRegExp = /今日回款金额：(\d+[.]?\d*)万元/
Report.paybackWeeklyRegExp = /本周回款金额：(\d+[.]?\d*)万元/
Report.paybackMonthlyRegExp = /月累计回款总金额：(\d+[.]?\d*)万元/
Report.paybackYearlyRegExp = /年度累计回款总金额：(\d+[.]?\d*)万元/
Report.allNotPaybackRegExp = /历年和本年已签未回款金额：(\d+[.]?\d*)万元/
