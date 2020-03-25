<template>
    <div>
      <div v-if="message && message.type === 0" :class="{inline:'text-single-line'}" v-html="$util.emotionStr(message.message)">
      </div>
      <div v-if="message && message.type === 1">
        <el-image fit="fit" class="pic" :src="message.message" v-if="inline" :preview-src-list="[message.message]"></el-image>
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
