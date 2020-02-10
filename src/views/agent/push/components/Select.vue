<template>
    <div class="select-receiver">
      <div class="searcher">
        <el-form :inline="true">
          <el-form-item label="用户标签">
            <el-select v-model="tagSelected" multiple>
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="phones" placeholder="多个手机号，以空格间隔"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="用户列表" name="用户列表">
          <push-user-list :tag-selected="tagSelected" :phones="phones"/>
        </el-tab-pane>
        <el-tab-pane name="已选列表">
          <span slot="label">
            <el-badge :value="selectedSize" class="item">
              已选列表
            </el-badge>
          </span>
          <selected-user-list />
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import PushUserList from './PushUserList'
import SelectedUserList from './SelectedUserList'
import {mapState} from 'vuex'
export default {
  mounted () {
    this.api.push.getTagList().then(
      this.api.commonResp((success, data) => {
        if (success) {
          data.forEach((item) => {
            this.tags.push(item)
          })
        }
      })
    )
  },
  data () {
    return {
      phones: '',
      activeTab: '用户列表',
      // 当前选择的用户标签
      tagSelected: [0],
      // 用户标签
      tags: [{
        id: 0,
        name: '全部'
      }]
    }
  },
  computed: {
    ...mapState({
      selectedSize: state => state.push.selectedSize
    })
  },
  methods: {
    nextStep () {
      this.$router.push({name: 'pushInfo'})
    },
    resetSearch () {
      this.phones = ''
      this.tagSelected = [0]
    },
    /**
     * 通知用户列表根据搜索的条件查询
     */
    search () {
      this.$bus.$emit('search-reload')
    }
  },
  components: {
    PushUserList,
    SelectedUserList
  }
}
</script>

<style scoped lang="less">
  .select-receiver {
    padding: 20px;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
