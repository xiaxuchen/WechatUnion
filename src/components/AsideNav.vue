<template>
  <div  class="aside-nav" style="background-color:#545c64" :style="{width:width + 'px'}">
    <div class="text-right" >
      <i class="fa font-lg collapse" :class="direction" style="color: white;padding: 10px 20px 0 0" @click="toggleCollapse"></i>
    </div>
    <el-menu
      :class="{'menu-padding':!isCollapse}"
      ref="menu"
      :default-active="activeIndex"
      background-color="#545c64"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      :collapse-transition="false"
      :router="true"
      :collapse="isCollapse"
      active-text-color="#ffd04b">
      <el-menu-item :index="nav.path" v-for="nav in navList" :key="nav.title">
        <i :class="nav.iconClass"></i>
        <span slot="title">{{nav.title}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideNav',
  data () {
    return {
      activeIndex: window.location.pathname,
      isCollapse: false,
      direction: 'fa-angle-double-left',
      widthPre: this.width
    }
  },
  props: {
    navList: {
      type: Array,
      required: true
    },
    width: {
      default: 200,
      type: Number
    }
  },
  model: {
    prop: 'width',
    event: 'collapse'
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    toggleCollapse () {
      let width
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.direction = 'fa-angle-double-right'
        width = 64
      } else {
        this.direction = 'fa-angle-double-left'
        width = this.widthPre
      }
      this.$emit('collapse', width)
    }
  }
}
</script>

<style scoped lang="less">

  .collapse{
    &:hover{
      cursor: pointer;
    }
  }
  .menu-padding {
    padding-left: 20px
  }
</style>
