<template>
    <div class="user-item" :class="{active:active}">
        <el-row>
          <el-col :span="6">
            <el-image :src="userInfo.headImg" class="head-img"/>
          </el-col>
          <el-col :span="18">
            <el-row>
              <el-col class="nickname" :span="10">
                {{userInfo.name}}
              </el-col>
              <el-col class="tel" :span="12">
                {{userInfo.phone?(userInfo.phone):'未绑定'}}
              </el-col>
              <el-col :span="2">
                <el-badge :value="userInfo.notRead" v-show="userInfo.notRead > 0" class="item" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 5px">
              <el-col :span="12" class="last-info">
                <message-shower :message="userInfo.lastMessage?userInfo.lastMessage:{}" />
              </el-col>
              <el-col :span="10" class="state">
                {{userInfo.lastTime}}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import MessageShower from '@/components/MessageShower'
export default {
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    curChatUser () {
      return this.$store.state.message.curChatUser
    }
  },
  components: {
    MessageShower
  }
}
</script>

<style scoped lang="less">
  .user-item {
    cursor: pointer;
    padding: 15px 25px;
    &.active {
      cursor: default;
      background-color: #f5f5f5;
    }
    .head-img {
      width: 40px;
      height: 40px;
    }

    .nickname {
      font-size: 14px;
    }

    .tel {
      font-size: 13px;
      color: #909399;
    }

    .last-info {
      font-size: 12px;
      color: #909399;
    }

    .state {
      font-size: 12px;
      color: #909399;
    }
  }
</style>
