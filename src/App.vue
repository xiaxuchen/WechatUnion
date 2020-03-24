<template>
  <div id="app">
    <router-view style="width: 100%;height: 100%"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import "assets/stylesheet/reset";
  @import "assets/stylesheet/common";
  #app {
    width: 100%;
    height: 100%;
  }
</style>
