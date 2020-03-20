<template>
    <div>
      <bottom-button-dialog title="修改密码" :visible.sync="localVisible" width="30%" confirm-button="修改" @on-confirm="AlterPassword">
        <el-form :model="pwdObj" :rules="rules" label-width="80px" ref="pwdForm">
          <el-form-item label="原密码" prop="originPwd">
            <el-input type="password" v-model="pwdObj.originPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="pwdObj.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="确  认" prop="confirmPwd">
            <el-input type="password" v-model="pwdObj.confirmPwd"></el-input>
          </el-form-item>
        </el-form>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
// 密码统一的校验规则
const pwdFormat = [{ required: true, message: '此为必填项', trigger: 'blur' },
  { min: 8, max: 32, message: '长度在8到32个字符之间', trigger: 'blur' }]
export default {
  components: {BottomButtonDialog},
  data: function () {
    return {
      pwdObj: {
        originPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      rules: {
        originPwd: [
          ...pwdFormat
        ],
        newPwd: [
          ...pwdFormat
        ],
        confirmPwd: [
          ...pwdFormat,
          {validator: this.confirmPwd(true), trigger: ['change', 'blur']}
        ]
      }
    }
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  computed: {
    localVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    alterPassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.pwdObj.newPwd === this.pwdObj.confirmPwd) {
          this.$emit('alter', this.pwdObj)
        } else {
          this.$message.error('格式错误!!')
          return false
        }
      })
    },
    /**
     * @param confirm 是否为confirm
     * @returns {Function} 验证函数
     */
    confirmPwd (confirm) {
      return (rule, value, callback) => {
        const other = confirm ? this.pwdObj.newPwd : this.pwdObj.confirmPwd
        if (value !== other) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
