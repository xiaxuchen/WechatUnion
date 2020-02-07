<template>
    <div>
      <!--编辑界面-->
      <bottom-button-dialog title="编辑用户" confirm-button="保存" :visible.sync="visible" @on-confirm="saveUser" :close-on-click-modal="false">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
          <el-row style="margin-left: -10px;">
            <el-col :span="12">
              <el-form-item label="登录名" prop="username">
                <el-input v-model="editForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="editForm.password" placeholder="可修改,但无法查看"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否禁用">
            <el-switch v-model="editForm.isInvalid" />
          </el-form-item>
          <el-form-item label="客户经理">
            <el-switch v-model="editForm.isAgent" />
          </el-form-item>
          <template v-if="editForm.isAgent">
            <el-row style="margin-left: -10px;">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="editForm.agentInfo.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="editForm.agentInfo.sex" placeholder="请选择性别">
                    <el-option label="未知" :value="-1"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="客服账号" prop="account">
              <el-input v-model="editForm.agentInfo.account"></el-input>
            </el-form-item>
            <el-form-item label="自我简介" prop="desc">
              <el-input type="textarea" v-model="editForm.agentInfo.desc"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
const FormInit = {
  username: '',
  password: '',
  isAgent: false,
  isInvalid: false,
  agentInfo: {
    name: '',
    sex: -1,
    account: '',
    desc: ''
  }
}
export default {
  components: {
    BottomButtonDialog
  },
  data () {
    return {
      editForm: FormInit,
      visible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$bus.$on('change-edit-sys-dialog', (visible, formData) => {
      if (visible) {
        let editForm = {...formData}
        editForm.isInvalid = editForm.state === 0
        editForm.isAgent = formData.roles ? formData.roles.some((item) => { return item.id === 2 }) : false
        this.editForm = editForm
      }
      this.visible = visible
    })
  },
  methods: {
    saveUser () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.visible = false
          // 必须属性之间加入
          let saveUser = {
            username: this.editForm.username,
            isAgent: this.editForm.isAgent,
            isInvalid: this.editForm.isInvalid
          }
          // 检查密码格式
          if (this.editForm.password) {
            if (this.editForm.password.length >= 5 && this.editForm.password.length <= 20) {
              saveUser.password = this.editForm.password
            } else {
              this.$message.error('密码的长度必须为5-20之间')
              return
            }
          }
          // 如果是经理，就加入经理信息
          if (this.editForm.isAgent) {
            saveUser.agentInfo = this.editForm.agentInfo
          }

          this.$emit('save-user', saveUser)
        } else {
          this.$message.error('请按要求填写用户信息')
          return false
        }
      })
    },
    validateName (rule, value, callback) {
      if (!this.editForm.isAgent) {
        callback()
        return
      }
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    },
    validateAccount (rule, value, callback) {
      if (!this.editForm.isAgent) {
        callback()
        return
      }
      if (value === '') {
        callback(new Error('请填写绑定的客服账号'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
