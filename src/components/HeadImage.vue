<template>
    <div>
      <el-image :src="computedURL" fit="fill" :style="styles"></el-image>
    </div>
</template>

<script>
export default {
  props: {
    url: String,
    styles: Object
  },
  data () {
    return {
      defaultHeadImg: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2799385184,4103603649&fm=115&gp=0.jpg'
    }
  },
  computed: {
    computedURL () {
      if (this.url == null || this.url === undefined || this.url.trim() === '') {
        return this.defaultHeadImg
      }
      if (this.url.startsWith('http')) {
        return this.url
      }
      // code
      return this.api.baseURL + '/resource/file/' + this.url
    }
  }
}
</script>

<style scoped lang="less">

</style>
