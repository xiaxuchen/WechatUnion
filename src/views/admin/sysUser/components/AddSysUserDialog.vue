<template>
    <div>
      <!--新增界面-->
      <bottom-button-dialog title="新增用户" :visible.sync="visible" @on-confirm="addUser" :close-on-click-modal="false">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
          <el-row style="margin-left: -10px;">
            <el-col :span="12">
              <el-form-item label="登录名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="客户经理">
            <el-switch v-model="addForm.isAgent"></el-switch>
          </el-form-item>
          <template v-if="addForm.isAgent">
            <el-row style="margin-left: -10px;">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="addForm.sex" placeholder="请选择性别">
                    <el-option label="未知" :value="-1"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="客服账号" prop="account">
              <el-input v-model="addForm.account"></el-input>
            </el-form-item>
            <el-form-item label="自我简介" prop="desc">
              <el-input type="textarea" v-model="addForm.desc"></el-input>
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
  name: '',
  sex: null,
  account: '',
  desc: ''
}
export default {
  components: {
    BottomButtonDialog
  },
  data () {
    return {
      addForm: {...FormInit},
      visible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$bus.$on('change-add-sys-dialog', (visible) => {
      this.addForm = {...FormInit}
      this.visible = visible
    })
  },
  methods: {
    addUser () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$emit('add-user', this.addForm)
        } else {
          this.$message.error('请按要求填写用户信息')
          return false
        }
      })
    },
    validateName (rule, value, callback) {
      if (!this.addForm.isAgent) {
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
      if (!this.addForm.isAgent) {
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
