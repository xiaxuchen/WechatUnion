<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.title}}
                </router-link>
                <span v-show="item.title!='系统首页'" class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close text-info"></i></span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="small" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="medium" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tagsList: []
    }
  },
  methods: {
    isActive (path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTags (index) {
      const delItem = this.tagsList.splice(index, 1)[0]
      const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1]
      if (item) {
        // 如果是缓存的就刷新缓存
        if (this.$route.meta.keep) {
          this.$route.meta.keep = false
          this.$nextTick(() => {
            this.$route.meta.keep = true
          })
        }
        delItem.path === this.$route.fullPath && this.$router.push(item.path)
      } else {
        this.$router.push('/index')
      }
    },
    // 关闭全部标签
    closeAll () {
      this.tagsList = []
      if (this.$route.path === '/index') {
        this.setTags(this.$route)
        return
      }
      this.$router.push('/index')
    },
    // 关闭其他标签
    closeOther () {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath
      })
      this.tagsList = curItem
    },
    // 设置标签
    setTags (route) {
      const isExist = this.tagsList.some(item => {
        return item.index === route.meta.index
      })
      !isExist && this.tagsList.push({
        title: route.meta.title,
        path: route.fullPath,
        index: route.meta.index,
        // name: route.matched[1].components.default.name
        name: route.name
      })
    },
    handleTags (command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  },
  computed: {
    showTags () {
      return this.tagsList.length > 0
    }
  },
  watch: {
    $route (newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  created () {
    this.setTags(this.$route)
  }
}

</script>

<style lang="less" scoped>
  @import url(../assets/stylesheet/common);
    @tag_height:34px;//tab高度变量
    .tags {
        position: relative;
        height: @tag_height;
        overflow: hidden;
        background: #fff;
        padding-right: 120px;
        flex: 0 0 auto;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: @tag_height - 8px;
        line-height: @tag_height - 8px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        color: #fff;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: @brand;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: @tag_height;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }

</style>
