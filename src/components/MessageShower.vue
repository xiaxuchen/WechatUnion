<template>
    <div>
      <div v-if="message && message.type === 0" class="text-single-line">
        {{message.message}}
      </div>
    </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">

</style>
