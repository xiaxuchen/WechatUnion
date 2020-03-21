<template>
    <div>
      <div v-if="message && message.type === 0" class="text-single-line">
        {{message.message}}
      </div>
      <div v-if="message && message.type === 1">
        <el-image fit="fit" class="pic" :src="message.message" v-if="inline"></el-image>
        <div v-else>
          [图片]
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    inline: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="less">
  .pic {
    max-width: 200px;
  }
</style>
