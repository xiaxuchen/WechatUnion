<template>
  <div class="about-info">
    <el-row>
      <el-col :span="12" align="center">
        <panel title="推送总览" style="width: 400px" :border="true">
          <template>
            <el-row class="padding-md">
              <el-col :span="6">
                <panel-item count="100" text="推送人数" />
              </el-col>
              <el-col :span="6">
                <panel-item count="10" text="当日接受" />
              </el-col>
              <el-col :span="6">
                <panel-item count="8000" text="本月次数" />
              </el-col>
              <el-col :span="6">
                <panel-item count="100" text="本月接受" />
              </el-col>
            </el-row>
          </template>
        </panel>
      </el-col>
      <el-col :span="12" align="center">
        <panel title="用户总览" style="width: 400px" :border="true">
          <template>
            <el-row class="padding-sm">
              <el-col :span="6">
                <panel-item count="9563" text="总用户数" />
              </el-col>
              <el-col :span="6">
                <panel-item count="3000" text="绑定用户数" />
              </el-col>
              <el-col :span="6">
                <panel-item count="12" text="昨日新增" />
              </el-col>
              <el-col :span="6">
                <panel-item count="100" text="本月新增" />
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
  components: {
    Panel,
    PanelItem
  }
}
</script>

<style scoped lang="less">

</style>
