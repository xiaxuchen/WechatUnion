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
            <el-button >恢复</el-button>
            <el-button type="primary">保存</el-button>
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
      userInfo: {
        username: 'xxcisbest',
        phone: '17779911413',
        headImg: 'http://pic2.zhimg.com/50/v2-fb824dbb6578831f7b5d92accdae753a_hd.jpg',
        isAgent: true,
        name: '夏旭晨',
        sex: 0,
        des: '一个乐观向上的客服，最大的愿望就是世界和平'
      },
      alterVisible: false
    }
  },
  methods: {
    onImageChange () {

    },
    showAlterPwd () {
      this.alterVisible = true
    },
    alterPwd (pwdObj) {
      console.log(pwdObj)
    }
  }
}
</script>

<style scoped lang="less">
  .mine {
    padding: 20px 30px;
  }
</style>
