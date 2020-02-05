<template>
  <el-container direction="vertical">
    <el-row>
        <v-header />
    </el-row>
    <el-row class="content" >
      <aside-nav id="aside" class="fl left" v-model="asideWidth" :nav-list="navList" />
      <div :style="{marginLeft:asideWidth + 'px'}">
        <v-tags />
        <el-scrollbar class="hidden-horizontal" :style="{height:scrollHeight + 'px'}">
          <router-view name="content" />
        </el-scrollbar>
      </div>
    </el-row>
  </el-container>
</template>

<script>
import AsideNav from '@/components/AsideNav'
import VHeader from '@/components/Header'
import VTags from '@/components/Tags'
export default {
  name: 'home',
  data () {
    return {
      navList: [
        {
          title: '系统首页',
          iconClass: 'el-icon-s-home',
          path: '/home'
        },
        {
          title: '用户接线',
          iconClass: 'fa fa-address-book',
          path: '/linkUser'
        },
        {
          title: '用户推送',
          iconClass: 'fa fa-rocket',
          path: '/select'
        },
        {
          title: '人员管理',
          iconClass: 'fa fa-users',
          path: '/manager'
        },
        {
          title: '系统管理',
          iconClass: 'el-icon-setting',
          subMenus: [
            {
              path: '/sysuser',
              title: '用户管理'
            }
          ]
        }
      ],
      asideWidth: 200,
      /**
         * 操作的事件
         */
      operateEvent: {
        event: '',
        count: 0
      }
    }
  },
  computed: {
    scrollHeight () {
      return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 70 - 34
    }
  },
  components: {
    AsideNav,
    VHeader,
    VTags
  },
  methods: {
    handleOperate (event) {
      this.operateEvent.event = event
      this.operateEvent.count++
    }
  }
}
</script>

<style scoped lang="less">
  @import url(./assets/stylesheet/common);
  #aside{
    background-color: #545c64;
    height: 100%;
  }
</style>
