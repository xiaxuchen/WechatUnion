<template>
    <div>
      <el-row style="margin-top: 200px;">
        <el-col align="center">
          <el-button type="primary" @click="showImportDialog">导入</el-button>
        </el-col>
      </el-row>
      <bottom-button-dialog :visible.sync="uploadDialogVisible" :bottom-visible="false">
        <template slot="title">
          <h2>用户经理关系导入</h2>
        </template>
        <template>
          <div align="center">
            <el-upload
              drag
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :action="excelUploadAction"
              :on-success="uploadRelation"
              :headers="headers"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </div>
        </template>
      </bottom-button-dialog>
    </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
export default {
  components: {
    BottomButtonDialog
  },
  data () {
    return {
      uploadDialogVisible: false,
      excelUploadAction: '',
      headers: {Authorization: this.$store.state.manager.token}
    }
  },
  methods: {
    uploadRelation () {
    },
    showImportDialog () {
      this.uploadDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">

</style>
