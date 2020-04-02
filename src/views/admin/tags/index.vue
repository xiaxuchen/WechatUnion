<template>
    <div class="tags">
      <el-row>
        <el-col :span="6" :push="2">
          <el-input placeholder="用户昵称或电话,回车搜索"
                    @keydown.enter.native="onSearch"
                    v-model="searchKey" />
        </el-col>
        <el-col :span="4" :push="8">
          <el-button v-if="curTagId !== null" type="primary" size="mini"
                     @click="uploadVisible = true">导入到当前标签</el-button>
        </el-col>
        <el-col :span="3" :push="11" align="right">
          <el-button type="primary" size="mini" @click="onAddTag"><q class="el-icon-plus"></q>新建标签</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :push="2" :span="16">
          <user-table :user-list="userList" :loading="userLoading">
            <template slot="tail">
              <el-table-column width="200px" fixed="right">
                <template slot-scope="{row}">
                  <el-button type="primary" size="mini" @click="onAddUserTag(row)">添加标签</el-button>
                  <el-button size="mini" @click="onShowAllTag(row)">所有标签</el-button>
                </template>
              </el-table-column>
            </template>
          </user-table>
          <el-pagination
            :total="total"
            :current-page="curPage"
            :page-size="pageSize"
            @current-change="onPageChange"
            @size-change="onSizeChange"
            layout="sizes, prev, pager, next"
          />
        </el-col>
        <el-col :span="5" :push="3">
          <div class="tag-list-wrap">
            <div class="font-sm tag-header">全部标签({{tagList.length}})</div>
            <div class="tag-item font-sm" @click="onTagSelect(null)">
              <q :class="{active:null === curTagId}"  class="el-icon-check active-icon" ></q>
              <span class="tag-name">&nbsp;全部用户 </span>
            </div>
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
      <bottom-button-dialog :bottom-visible="false" :visible.sync="uploadVisible" title="添加标签用户">
        <template>
          <upload :action="uploadData.action"
                  :model-action="uploadData.modelAction"
                  :data="{tagId:curTagId}"
                  :on-success="onUploadSuccess"
          />
        </template>
      </bottom-button-dialog>
      <bottom-button-dialog :visible.sync="addTagVisible" title="添加标签" width="30%" @on-confirm="onConfirmAddTag">
        <div align="center">
          <el-select v-model="toAddTagId" >
            <el-option v-for="tag in tagList"
                       :key="tag.id"
                       :value="tag.id"
                       :label="tag.name"
            />
          </el-select>
        </div>
      </bottom-button-dialog>
      <bottom-button-dialog :visible.sync="allTagVisible" title="所有标签" width="30%" :bottom-visible="false">
        <div align="center">
          <el-tag v-for="tag in curUser.tags" :key="tag.id" style="margin: 5px">
            {{tag.name}}  <q class="el-icon-delete" @click="onDeleteTagOfUser(tag.userTagId)"></q>
          </el-tag>
        </div>
      </bottom-button-dialog>
    </div>
</template>

<script>
import UserTable from '@/components/UserTable'
import BottomButtonDialog from '@/components/BottomButtonDialog'
import TagBusiness from '@/views/admin/tags/tag.business'
import Upload from '@/components/Upload'

export default {
  data () {
    return {
      // 搜索关键字
      searchKey: '',
      // 用户数据加载中
      userLoading: false,
      // 上传对话框是否显示
      uploadVisible: false,
      uploadData: {
        action: `${this.api.baseURL}/tag/user/list`,
        modelAction: `${this.api.baseURL}/resource/template/tag`
      },
      // 用户数据
      userList: [],
      total: 0,
      curPage: 1,
      pageSize: 20,
      // 当前选中的标签
      curTagId: null,
      tagList: [],
      tagBusiness: new TagBusiness(this),
      // 显示给用户添加标签对话框
      addTagVisible: false,
      // 准备添加的标签id
      toAddTagId: null,
      // 当前操作标签的用户
      curUser: {
        tags: []
      },
      // 显示所有标签
      allTagVisible: false
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
     * 导入成功
     * **/
    onUploadSuccess () {
      // 重新加载一下
      this.tagBusiness.loadUsers()
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
    },
    onAddUserTag (row) {
      this.addTagVisible = true
      this.curUser = row
    },
    onShowAllTag (row) {
      this.curUser = row
      this.allTagVisible = true
    },
    // 确认添加标签
    onConfirmAddTag () {
      this.tagBusiness.addUserTag()
    },
    /**
     * 删除用户与标签之间的关系
     * @param userTagId 用户标签关系id
     */
    onDeleteTagOfUser (userTagId) {
      this.tagBusiness.deleteTagOfUser(userTagId)
    }
  },
  components: {
    Upload,
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
