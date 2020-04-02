<template>
    <div>
      <el-row style="margin-top: 20px;margin-left: 40px">
        <el-col>
          <el-button type="primary mini" @click="showImportDialog(0)">覆盖导入</el-button>
          <el-button type="primary mini" @click="showImportDialog(1)">忽略导入</el-button>
        </el-col>
      </el-row>
      <p class="font-sm text-info" style="margin-left: 40px">若覆盖导入，则有其他经理关联强制解除，关联到当前经理</p>
      <user-list :id="parseInt(id)" style="padding: 10px 40px"/>
      <el-row v-show="excludes && excludes.length > 0" style="margin: 20px 40px">
        <el-col class="warn-title" >
          <span v-if="lastMode == 0">以下为导入覆盖的记录:</span>
          <span v-if="lastMode == 1">以下是导入失败的记录(已与其他经理关联):</span>
        </el-col>
        <el-input type="textarea" :value="computedExcludes"></el-input>
      </el-row>
      <bottom-button-dialog :visible.sync="uploadDialogVisible" :bottom-visible="false">
        <template slot="title">
          <h2>用户经理关系导入</h2>
        </template>
        <template>
          <div align="center">
            <upload :action="excelUploadAction"
                    :model-action="modelAction"
                    :on-success="uploadRelation"
                    :on-progress="clearLast"
                    :data="params"
            />
          </div>
        </template>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
import UserList from './components/UserList'
import Upload from '@/components/Upload'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    Upload,
    BottomButtonDialog,
    UserList
  },
  data () {
    return {
      uploadDialogVisible: false,
      excelUploadAction: this.api.baseURL + '/sysuser/belong',
      modelAction: this.api.baseURL + '/resource/template/phone',
      excludes: [],
      // 导入的模式
      mode: 0,
      // 上次导入的模式
      lastMode: 0
    }
  },
  computed: {
    params () {
      return {
        mode: this.mode,
        agentId: this.id
      }
    },
    computedExcludes () {
      return this.excludes.reduce((sum, value) => {
        if (sum == null) {
          return value
        }
        return sum + ',' + value
      }, null)
    }
  },
  methods: {
    // 清除上次的记录
    clearLast () {
      // 发送请求前清空以前的记录
      this.excludes = []
      this.lastMode = this.mode
    },
    // 导入成功
    uploadRelation (response) {
      if (response.success) {
        this.uploadDialogVisible = false
        this.$message('导入成功')
        if (response.data) {
          this.excludes = response.data
        }
      } else {
        this.$message.error(response.msg)
      }
    },
    // 显示导入的对话框
    showImportDialog (mode) {
      // 设置导入模式
      this.mode = mode
      this.uploadDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">
  .warn-title {
    margin: 10px 0;
    text-align: left;
  }
</style>
