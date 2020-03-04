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
          <el-row style="margin-left: -10px;">
            <el-col :span="12">
              <el-form-item label="电话" >
                <el-input v-model="editForm.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="头像" >
            <upload-image @on-image-change="onImageChange" :cur-image="editForm.headImg"/>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-switch v-model="editForm.isInvalid" />
          </el-form-item>
          <el-form-item label="客户经理">
            <el-switch v-model="editForm.isAgent" />
          </el-form-item>
          <template v-if="editForm.isAgent" style="margin-left: -10px;">
            <el-row >
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="editForm.agentInfo.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="editForm.agentInfo.sex" placeholder="请选择性别">
                    <el-option label="未知" :value="0"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="客服账号" prop="account">
              <el-input v-model="editForm.agentInfo.account"></el-input>
            </el-form-item>
            <el-form-item label="自我简介" prop="des">
              <el-input type="textarea" v-model="editForm.agentInfo.des"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
import UploadImage from './UploadImage'
const FormInit = {
  username: '',
  password: '',
  phone: '',
  sex: 0,
  isAgent: false,
  isInvalid: false,
  headImg: '',
  agentInfo: {
    name: '',
    account: '',
    des: ''
  }
}
export default {
  components: {
    BottomButtonDialog,
    UploadImage
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
      console.log(JSON.stringify(formData))
      if (visible) {
        let editForm = {...formData}
        editForm.isInvalid = editForm.state === 0
        editForm.isAgent = formData.roles ? formData.roles.some((item) => { return item.id === 2 }) : false
        if (!editForm.isAgent) {
          editForm.agentInfo = {}
        }
        this.editForm = editForm
      }
      this.visible = visible
    })
  },
  methods: {
    onImageChange (url) {
      this.editForm = Object.assign({
        headImg: url
      }, this.editForm)
    },
    saveUser () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.visible = false
          // 必须属性之间加入
          let saveUser = {
            userId: this.editForm.userId,
            username: this.editForm.username,
            isAgent: this.editForm.isAgent,
            isInvalid: this.editForm.isInvalid,
            headImg: this.editForm.headImg
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
            let agentInfo = {...this.editForm.agentInfo}
            agentInfo.agentId = agentInfo.id
            delete agentInfo.id
            // 将客户经理的信息复制进用户信息中
            Object.keys(agentInfo).forEach(key => {
              saveUser[key] = agentInfo[key]
            })
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
