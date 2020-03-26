<template>
  <div  class="aside-nav" style="background-color:#545c64;" :style="{width:width + 'px',height:height + 'px'}">
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
        <div :is="nav.subMenus? 'el-submenu': 'el-menu-item'" :index="nav.path" v-for="nav in navList" :key="nav.title">
          <template slot="title" v-if="nav.subMenus">
            <i :class="nav.iconClass"></i><span slot="title">{{ nav.title }}</span>
          </template>
          <el-menu-item v-for="menu in nav.subMenus" :key="menu.path" :index="menu.path" v-if="nav.subMenus">
            {{ menu.title }}
          </el-menu-item>
          <i :class="nav.iconClass" v-if="!nav.subMenus"></i>
          <span slot="title" v-if="!nav.subMenus">{{nav.title}}</span>
        </div>
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
  computed: {
    height () {
      return this.$store.state.system.availableHeight
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
  watch: {
    $route (to, from) {
      this.activeIndex = to.meta.index
    }
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

  .aside-nav {
    &::-webkit-scrollbar{
      width: 0;
    }
    &> ul {
      height:100%;
    }
  }
</style>
