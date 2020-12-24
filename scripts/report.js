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

  get formatedDate() {
    return formatDate(this.date)
  }

  prase(input) {
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
    return `${this.formatedDate}，青浦新城一站项目销售日报

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

Report.dateRegExp = /^(\d+)年(\d+)月(\d+)日，青浦新城一站项目销售日报/
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

module.exports = Report