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
      <!--<el-col :span="2" :push="15">-->
        <!--<div class="agentInfo" >-->
          <!--<el-dropdown trigger="click" @command="onToggleOnline">-->
            <!--<span class="title">-->
              <!--{{agentInfo.name}} <q class="el-icon-arrow-down"></q>-->
            <!--</span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item command="online">在线 <q class="el-icon-check" v-if="isOnline"/></el-dropdown-item>-->
              <!--<el-dropdown-item command="leave">离开 <q class="el-icon-check" v-if="!isOnline"/></el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
        <!--</div>-->
      <!--</el-col>-->
      <!--<el-col :span="2" :push="15">-->
        <!--<div class="setting" @click="toggleTab(2)" :class="{active:curTab === 2}">-->
          <!--<q class="el-icon-s-tools" ></q>-->
        <!--</div>-->
      <!--</el-col>-->
    </el-row>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      curTab: 0,
      isOnline: false,
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
  },
  methods: {
    toggleTab (index) {
      this.curTab = index
      this.$emit('toggle-tab', index)
    },
    onToggleOnline (command) {
      switch (command) {
        case 'online': {
          this.isOnline = true
          break
        }
        case 'leave': {
          this.isOnline = false
        }
      }
      this.$emit('toggle-online', this.isOnline)
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

    .agentInfo {
      cursor: pointer;
      .title {
        color: #ffffff;
      }
    }
  }
</style>
