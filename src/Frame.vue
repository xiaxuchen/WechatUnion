<template>
  <el-container direction="vertical">
    <el-row>
        <v-header />
    </el-row>
    <el-row class="content" >
      <aside-nav id="aside" class="fl left" v-model="asideWidth" :nav-list="navList" />
      <div :style="{marginLeft:asideWidth + 'px'}">
        <el-card :body-style="{padding: 0}">
          <v-tags />
        </el-card>
        <el-scrollbar class="hidden-horizontal" :style="{height:scrollHeight + 'px'}">
          <keep-alive>
             <router-view v-if="$route.meta.keep" :height="scrollHeight"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keep" :height="scrollHeight"></router-view>
        </el-scrollbar>
      </div>
    </el-row>
    <loading-dialog />
  </el-container>
</template>

<script>
import AsideNav from '@/components/AsideNav'
import VHeader from '@/components/Header'
import VTags from '@/components/Tags'
import LoadingDialog from '@/components/LoadingDialog'
export default {
  mounted () {
    // 刷新当前用户信息
    this.$store.dispatch('manager/refresh')
    this.scrollHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 70 - 34
    this.$store.commit('system/setAvailableHeight', this.scrollHeight)
    window.onresize = () => {
      this.scrollHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 70 - 34
      this.$store.commit('system/setAvailableHeight', this.scrollHeight)
    }
  },
  data () {
    return {
      navList: [
        {
          title: '系统首页',
          iconClass: 'el-icon-s-home',
          path: '/index'
        },
        {
          title: '用户接线',
          iconClass: 'fa fa-address-book',
          path: '/clientServe'
        },
        {
          title: '用户推送',
          iconClass: 'fa fa-rocket',
          path: '/push'
        },
        {
          title: '系统管理',
          iconClass: 'el-icon-setting',
          path: '/system',
          subMenus: [
            {
              path: '/sysUser',
              title: '管理员管理'
            },
            {
              path: '/tags',
              title: '用户管理'
            }
          ]
        }
      ],
      asideWidth: 200,
      scrollHeight: 0,
      /**
         * 操作的事件
         */
      operateEvent: {
        event: '',
        count: 0
      }
    }
  },
  components: {
    AsideNav,
    VHeader,
    VTags,
    LoadingDialog
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
