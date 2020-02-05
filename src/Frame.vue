<template>
  <el-container direction="vertical">
    <el-row>
      <router-view name="nav" />
      <!--<el-container class="full-width" style="height: 60px" direction="horizontal">-->
        <!--<el-row class="full-width shadow-base container-border">-->
          <!--<div class="left" style="width: 200px">-->
            <!--<a href="#" style="vertical-align: middle;background-color: white;width: 200px;height: 60px;line-height: 60px" >-->
            <!--</a>-->
          <!--</div>-->
          <!--<div class="right container-border box-border" style="padding: 0 300px 0 200px;">-->
          <!--</div>-->
          <!--<div class="addition">-->
          <!--</div>-->
        <!--</el-row>-->
      <!--</el-container>-->
    </el-row>
    <div class="content-wrap">
      <aside-nav  class="fl" v-model="asideWidth" :nav-list="navList"></aside-nav>
      <div class="content box-border" :style="{marginLeft:asideWidth + 'px',paddingRight:asideWidth + 'px'}" >
        <router-view name="content"/>
      </div>
    </div>
  </el-container>
</template>

<script>
import AsideNav from './components/AsideNav'

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
          title: '我的信息',
          iconClass: 'fa fa-user',
          path: '/mine'
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
  components: {
    AsideNav
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
  }

  .content-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    .aside-nav{
      height: 100%;
    }
    .content{
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }

  .addition{
    width: 300px;
    font-size: 20px;
    line-height: 60px;
    float: right;
    text-align: center;
    position: relative;
    z-index: 100;
  }
  .addition:hover{
    color: @brand;
    cursor: pointer;
  }

</style>
