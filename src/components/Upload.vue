<template>
  <div align="center" class="upload">
    <div v-if="modelAction" style="margin: 10px">
      <a :href="modelAction">
        <el-button type="primary">
          <q class="el-icon-download"></q>下载模板
        </el-button>
      </a>
    </div>
    <el-upload
      drag
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :action="action"
      :on-success="onSuccess"
      :data="data"
      :headers="headers?headers:defaultHeaders"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    // 请求头
    headers: {
      type: Object
    },
    // 上传路径
    action: {
      type: String,
      required: true
    },
    modelAction: String,
    data: Object
  },
  computed: {
    defaultHeaders () {
      return {Authorization: this.$store.state.manager.token}
    }
  },
  methods: {
    onSuccess (resp) {
      this.$emit('upload-success', resp)
    }
  }
}
</script>

<style scoped lang="less">

</style>
