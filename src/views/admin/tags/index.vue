<template>
    <div class="tags">
      <el-row>
        <el-col :span="6" :push="2">
          <el-input placeholder="用户昵称或电话,回车搜索" @keydown.enter.native="onSearch" v-model="searchKey" ></el-input>
        </el-col>
        <el-col :span="3" :push="15" align="right">
          <el-button type="primary" size="mini" @click="onAddTag"><q class="el-icon-plus"></q>新建标签</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :push="2" :span="16">
          <user-table :user-list="userList" :loading="userLoading"/>
          <el-pagination
            :total="total"
            :current-page="curPage"
            :page-size="pageSize"
            @current-change="onPageChange"
            @size-change="onSizeChange"
          />
        </el-col>
        <el-col :span="5" :push="3">
          <div class="tag-list-wrap">
            <div class="font-sm tag-header">全部用户({{userCount}})</div>
            <div class="tag-item font-sm" v-for="(tag,index) in tagList" :key="tag.id" @click="onTagSelect(tag.id)">
              <q :class="{active:tag.id === curTagId}"  class="el-icon-check active-icon" ></q>
              <span @click.stop="onEditTag(tag, index)" class="tag-name">&nbsp;{{tag.name}} ({{tag.count}})</span>
              <el-button size="mini" type="text" @click.stop="onDeleteTag(tag.id, index)" v-show="tag.id !== curTagId">
                <q class="el-icon-delete"></q>
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import UserTable from '@/components/UserTable'
import BottomButtonDialog from '@/components/BottomButtonDialog'
import TagBusiness from '@/views/admin/tags/tag.business'

export default {
  data () {
    return {
      // 搜索关键字
      searchKey: '',
      // 用户数据加载中
      userLoading: false,
      // 用户数据
      userList: [],
      total: 0,
      curPage: 1,
      pageSize: 20,
      // 当前选中的标签
      curTagId: 1,
      tagList: [],
      tagBusiness: new TagBusiness(this)
    }
  },
  mounted () {
    this.tagBusiness.init()
  },
  computed: {
    /**
     * 用户总数量
     * @return {number}
     */
    userCount () {
      return 9561
    }
  },
  methods: {
    // 页面改变
    onPageChange (page) {
      this.curPage = page
      this.tagBusiness.loadUsers()
    },
    // 每页的数量改变
    onSizeChange (size) {
      this.pageSize = size
      this.tagBusiness.loadUsers()
    },
    // 当前标签被选中
    onTagSelect (tagId) {
      this.curTagId = tagId
      console.log('....')
      this.tagBusiness.loadUsers()
    },
    // 输入框输入了回车
    onSearch () {
      this.tagBusiness.loadUsers()
    },
    onAddTag () {
      this.$prompt('请输入标签名', '新建标签', {
        confirmButtonText: '添加',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$common.showLoading()
        this.tagBusiness.addTag(value)
      })
    },
    onEditTag (tag, index) {
      this.$prompt('请输入标签名', '修改标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: tag.name
      }).then(({ value }) => {
        this.tagBusiness.updateTag(value, tag.id, index)
      })
    },
    /**
     * 点击删除
     * @param tagId 标签的id
     */
    onDeleteTag (tagId, index) {
      this.$confirm('确认删除标签吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$common.showLoading()
        this.tagBusiness.deleteTag(tagId, index)
      })
    }
  },
  components: {
    BottomButtonDialog,
    UserTable
  }
}
</script>

<style scoped lang="less">
  @import url(../../../assets/stylesheet/common);
  .tags {
    padding: 25px 40px;
    .tag-list-wrap {
      border: 1px solid #E7E6EB;
      .tag-header {
        padding: 10px 10px;
        background: #F4F5F9;
      }
      .tag-item {
        padding: 10px 0 10px 25px;
        cursor: pointer;
        .tag-name {
          cursor:grab;
          display: inline-block;
          width: 140px;
          margin-left: 10px;
          -moz-user-select:none;
          -webkit-user-select:none;
          user-select:none;
        }
        .active-icon {
          visibility: hidden;
          cursor: default;
          background-color: #909399;
          color: white;
          &.active {
            visibility: visible;
          }
        }
      }
    }
  }
</style>
