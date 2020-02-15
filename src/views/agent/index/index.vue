<template>
    <div class="index">
      <about-info style="margin-top: 20px" :about-info="aboutInfo"/>
      <div style="padding: 20px 100px 0px 100px">
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
  mounted () {
    this.api.push.getIndexData()
      .then(this.api.commonResp((success, data) => {
        this.chartData = Object.assign({}, this.chartData, {
          rows: data.chartData.map((item) => {
            return {
              '日期': item.date,
              '接受用户': item.receiveUserCount,
              '回复用户': item.responseUserCount,
              '回复率': item.percent
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
        columns: ['日期', '接受用户', '回复用户', '回复率'],
        rows: []
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
