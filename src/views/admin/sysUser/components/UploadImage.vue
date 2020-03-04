<template>
    <div>
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :action="api.baseURL + '/resource/file'"
        :on-success="handleAvatarSuccess"
        :headers="headers"
        >
        <head-image v-if="curImage" :url="curImage" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
</template>

<script>
import HeadImage from '@/components/HeadImage'
export default {
  components: {HeadImage},
  data () {
    return {
      headers: {Authorization: this.$store.state.manager.token}
    }
  },
  props: {
    curImage: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleAvatarSuccess (response) {
      let data = response
      if (data.success) {
        this.$emit('on-image-change', data.data)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .avatar-uploader {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 64px;
    height: 64px;
    i {
      border-radius: 6px;
      display: block;
      width: 60px;
      height: 60px;
      border: 1px dashed #d9d9d9;
    }
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 64px;
    height: 64px;
    line-height: 64px;
    text-align: center;
  }
  .avatar {
    width: 64px;
    height: 64px;
    display: block;
  }
</style>
