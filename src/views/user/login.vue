<template>
    <div>
      <div class="login-container">
        <div class="bg"></div>
        <div class="login-page">
          <el-row>
            <el-form :model="ruleForm" :rules="rules"
                     status-icon
                     ref="ruleForm"
                     label-position="left"
                     label-width="0px"
                     class="demo-ruleForm">
              <h2 class="text-center title">登录</h2>
              <el-form-item prop="username">
                <el-input type="text"
                          v-model="ruleForm.username"
                          auto-complete="off"
                          placeholder="用户名"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password"
                          v-model="ruleForm.password"
                          auto-complete="off"
                          placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-col align="right" class="forget-password" v-if="false"><a href="#">忘记密码?</a></el-col>
          </el-row>
        </div>
      </div>
    </div>
</template>

<script>
import api from '../../api'

export default {
  data () {
    return {
      logining: false,
      ruleForm: {
        username: '',
        password: ''
      },
      localCount: 10,
      rules: {
        username: [{ required: true, message: '请输入你的用户名', trigger: 'blur' }, { min: 6, max: 20, message: '用户名长度在6到20位之间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 20, message: '用户名长度在6到20位之间', trigger: 'blur' }]
      },
      checked: false
    }
  },
  methods: {
    handleSubmit (event) {
      this.loginError = ''
      let vm = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true
          api.sysuser.login(vm.ruleForm.username, vm.ruleForm.password)
            .then(api.commonResp((success, data, response) => {
              if (success) {
                vm.$notify({
                  title: '恭喜您',
                  message: '登录成功',
                  type: 'success'
                })
                vm.$store.commit('manager/setToken', response.headers['token'])
                vm.$store.commit('manager/setManager', data)
                vm.$router.push({ name: 'index' })
              } else {
                this.$message.error(data)
              }
            })).catch(reason => {
              this.$message.error(reason)
            }).finally(() => {
              this.logining = false
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .bg{
    background: url("../../assets/images/login-bg.jpg");
    background-size: 100% auto;
    width: 100%;
    height: 100%;
    position: fixed;
  }
  .login-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .login-page {
    position: relative;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto 0 auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .title {
    padding-bottom: 20px;
  }

  .forget-password {
    a {
      font-size: 14px;
      font-weight: normal;
    }
  }
</style>
