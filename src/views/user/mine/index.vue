<template>
    <div class="mine">
      <el-row>
        <el-col align="right">
          <el-button type="text" @click="showAlterPwd">修改密码</el-button>
        </el-col>
      </el-row>
      <el-form>
        <el-form-item align="center" >
          <upload-image @on-image-change="onImageChange" :cur-image="userInfo.headImg"/>
        </el-form-item>
        <el-form :model="userInfo" label-width="100px">
          <el-form-item label="登录名" prop="username">
            <el-input v-model="userInfo.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="电话" >
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <template v-if="userInfo.isAgent" style="margin-left: -10px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="userInfo.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="userInfo.sex" placeholder="请选择性别">
                    <el-option label="未知" :value="0"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="自我简介" prop="des">
              <el-input type="textarea" v-model="userInfo.des"></el-input>
            </el-form-item>
          </template>
          <el-form-item align="right">
            <el-button @click="reset">恢复</el-button>
            <el-button type="primary" @click="saveUser">保存</el-button>
          </el-form-item>
        </el-form>
      </el-form>
      <alter-password :visible.sync="alterVisible" @alter="alterPwd"></alter-password>
    </div>
</template>

<script>
import AlterPassword from './components/AlterPassword'
import UploadImage from '@/views/admin/sysUser/components/UploadImage'
export default {
  components: {
    UploadImage,
    AlterPassword
  },
  data () {
    return {
      userInfo: {},
      alterVisible: false
    }
  },
  computed: {
    mineInfo () {
      return this.$store.state.manager.manager
    }
  },
  watch: {
    mineInfo: {
      handler (newValue) {
        this.userInfo = {...newValue}
      },
      immediate: true
    }
  },
  methods: {
    onImageChange (img) {
      this.userInfo.headImg = img
    },
    showAlterPwd () {
      this.alterVisible = true
    },
    alterPwd (pwdObj) {
      this.api.sysuser.alterPwd(pwdObj.originPwd, pwdObj.newPwd)
        .commonThen((success, data) => {
          if (success && data) {
            this.$message('密码修改成功')
            this.alterVisible = false
          }
        }, this)
    },
    // 重置
    reset () {
      this.userInfo = this.mineInfo
    },
    saveUser () {
      const userInfo = this.userInfo
      if (userInfo.isAgent) {
        if (!userInfo.name) {
          this.$message.error('客户经理的名字不能为空')
          return
        }
      }
      this.api.sysuser.updateUser({
        userId: userInfo.id,
        ...userInfo,
        isInValid: false
      }).commonThen((success) => {
        if (success) {
          this.$message('保存成功')
        }
      }, this)
    }
  }
}
</script>

<style scoped lang="less">
  .mine {
    padding: 20px 30px;
  }
</style>
