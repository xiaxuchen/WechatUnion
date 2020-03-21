<template>
  <div class="about-info">
    <el-row>
      <!--<el-col :span="12" align="center">-->
        <!--<panel title="推送总览" style="width: 400px" :border="true">-->
          <!--<template>-->
            <!--<el-row class="padding-md">-->
              <!--<el-col :span="6">-->
                <!--<panel-item :count="aboutInfo.allPushCount" text="推送人数" />-->
              <!--</el-col>-->
              <!--<el-col :span="6">-->
                <!--<panel-item :count="aboutInfo.lastDayReceiveCount" text="昨日接收" />-->
              <!--</el-col>-->
              <!--<el-col :span="6">-->
                <!--<panel-item :count="aboutInfo.theMounthPushCount" text="本月次数" />-->
              <!--</el-col>-->
              <!--<el-col :span="6">-->
                <!--<panel-item :count="aboutInfo.theMounthReceiveCount" text="本月接收" />-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</template>-->
        <!--</panel>-->
      <!--</el-col>-->
      <el-col :span="12" :push="12" align="center">
        <panel title="用户总览" style="width: 400px" :border="true">
          <template>
            <el-row class="padding-sm">
              <el-col :span="6">
                <panel-item :count="aboutInfo.allUserCount" text="总用户数" />
              </el-col>
              <el-col :span="6">
                <panel-item :count="aboutInfo.bindUserCount" text="绑定用户数" />
              </el-col>
              <el-col :span="6">
                <panel-item :count="aboutInfo.lastDayUserAddCount" text="昨日新增" />
              </el-col>
              <el-col :span="6">
                <panel-item :count="aboutInfo.theMounthUserAddCount" text="本月新增" />
              </el-col>
            </el-row>
          </template>
        </panel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Panel from '@/components/Panel'
import PanelItem from './PanelItem'
export default {
  props: {
    aboutInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Panel,
    PanelItem
  }
}
</script>

<style scoped lang="less">

</style>
