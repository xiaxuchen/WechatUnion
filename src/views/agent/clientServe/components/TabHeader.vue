<template>
  <div class="tab-header">
    <el-row>
      <el-col :span="3">
        <div  @click="toggleTab(0)"  class="tab" :class="{active:curTab === 0}">
          <i class="el-icon-chat-line-round" ></i> {{respondCount}}人待回复
        </div>
      </el-col>
      <el-col :span="3">
        <div  @click="toggleTab(1)"  class="tab" :class="{active:curTab === 1}">
          <i class="el-icon-time" ></i> {{waitCount}}人待接入
        </div>
      </el-col>
      <el-col :span="2" :push="15">
        <agent-info :agent-info="agentInfo" @toggle-online="onToggleOnline"/>
      </el-col>
      <el-col :span="2" :push="15">
        <div class="setting" @click="toggleTab(2)" :class="{active:curTab === 2}">
          <q class="el-icon-s-tools" ></q>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AgentInfo from './AgentInfo'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      curTab: 0,
      agentInfo: {
        name: '夏旭晨',
        isOnline: true
      }
    }
  },
  computed: {
    ...mapState({
      waitCount: state => state.message.waitCount,
      respondCount: state => state.message.respondCount})
  },
  components: {
    AgentInfo
  },
  methods: {
    toggleTab (index) {
      this.curTab = index
      this.$emit('toggle-tab', index)
    },
    onToggleOnline (isOnline) {
      console.log('切换在线')
    }
  }
}
</script>

<style scoped lang="less">
  .tab-header {
    padding: 8px 0;
    .tab {
      font-size: 16px;
      cursor: pointer;
      &.active {
        color: #67C23A;
      }
    }

    .setting {
      cursor: pointer;
      font-size: 20px;
      &.active {
        color: #67C23A;
      }
    }
  }
</style>
