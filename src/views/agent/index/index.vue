<template>
    <div class="index">
      <about-info style="margin-top: 20px" :about-info="aboutInfo"/>
      <div style="padding: 20px 100px 0 100px">
        <ve-line :data="chartData"></ve-line>
      </div>
    </div>
</template>

<script>
import AboutInfo from './components/AboutInfo'
export default {
  components: {
    AboutInfo
  },
  activated () {
    console.log('gagag')
  },
  mounted () {
    this.api.push.getIndexData()
      .then(this.api.commonResp((success, data) => {
        this.chartData = Object.assign({}, this.chartData, {
          rows: data.chartData.map((item) => {
            return {
              '日期': item.date,
              '推送用户': item.receiveUserCount,
              '接受用户': item.responseUserCount,
              '送达率': item.percent
            }
          })
        })
        data.chartData = null
        this.aboutInfo = data
      }, this))
  },
  data: function () {
    return {
      aboutInfo: {},
      chartData: {
        columns: ['日期', '推送用户', '接受用户', '接受率'],
        rows: []
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
