<template>
  <div class="agentInfo" >
    <el-dropdown trigger="click" @command="onCommand">
      <span class="title">
        {{agentInfo.name}} <q class="el-icon-arrow-down"></q>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="online">在线 <q class="el-icon-check" v-if="isOnline"/></el-dropdown-item>
        <el-dropdown-item command="leave">离开 <q class="el-icon-check" v-if="!isOnline"/></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    agentInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isOnline: false
    }
  },
  methods: {
    onCommand (command) {
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
  .agentInfo {
    cursor: pointer;
    .title {
      color: #ffffff;
    }
  }
</style>
