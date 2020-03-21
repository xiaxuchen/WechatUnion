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
                <el-input v-model="addForm.password" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: -10px;">
            <el-col :span="12">
              <el-form-item label="电话" >
                <el-input v-model="addForm.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="头像" >
            <upload-image @on-image-change="onImageChange" :cur-image="addForm.headImg"/>
          </el-form-item>
          <el-form-item label="客户经理">
            <el-switch v-model="addForm.isAgent"></el-switch>
          </el-form-item>
          <template v-if="addForm.isAgent" style="margin-left: -10px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="addForm.sex" placeholder="请选择性别">
                    <el-option label="未知" :value="0"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="自我简介" prop="des">
              <el-input type="textarea" v-model="addForm.des"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
import HeadImage from '@/components/HeadImage'
import UploadImage from './UploadImage'
const FormInit = {
  username: '',
  password: '',
  isAgent: false,
  name: '',
  sex: null,
  phone: '',
  des: '',
  headImg: ''
}
export default {
  components: {
    HeadImage,
    BottomButtonDialog,
    UploadImage
  },
  data () {
    return {
      addForm: {...FormInit},
      headImgUrl: '',
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
    onImageChange (url) {
      this.addForm.headImg = url
      this.headImgUrl = url
    },
    addUser () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.headImgUrl == null) {
            this.$message.error('请上传用户头像')
            return true
          }
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
