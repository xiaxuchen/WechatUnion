<template>
  <div class="sys-user">
    <search-bar @search="onSearch" />
    <div style="padding: 20px 0">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="addManager" size="mini" round>新增</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deleteSelectedManagers" size="mini" round>删除</el-button>
    </div>
    <manager-table
      :sysuser-list="sysuserList"
      :list-loading="listLoading"
      @delete-manager="deleteManagers([$event])"
      @select-change="onManagerSelectChange"
    />
    <!-- 分页 -->
    <div style="margin-top: 20px">
      <el-pagination
        @current-change="pageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper, total"
        :total="total" />
    </div>
  </div>
</template>
<script>
import SearchBar from './components/SearchBar'
import ManagerTable from './components/ManagerTable'
export default {
  mounted () {
    // 初始加载用户信息
    this.loadUserList()
  },
  components: {
    SearchBar,
    ManagerTable
  },
  data () {
    return {
      // table返回的数据
      sysuserList: [],
      // 列表Loading加载
      listLoading: false,
      // 批量选中data
      selectedUserIds: [],
      // 分页
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    // 筛选用户信息
    onSearch (filters) {
      console.log(JSON.stringify(filters))
    },
    pageChange (page) {
      this.curPage = page
      this.loadUserList()
    },
    deleteSelectedManagers () {
      this.deleteManagers(this.selectedUserIds)
    },
    deleteManagers (ids) {
      console.log(ids)
    },
    addManager () {
    },
    onManagerSelectChange (ids) {
      this.selectedUserIds = ids
    },
    loadUserList () {
      this.listLoading = true
      this.api.sysuser
        .getSysUserList(this.curPage, this.pageSize)
        .then(this.api.commonResp((success, data) => {
          if (success) {
            this.sysuserList = data.users
            this.total = data.total
          } else {
            this.$message.error(data)
          }
          this.listLoading = false
        }))
    }
  }
}
</script>

<style lang="less" scoped>
  .sys-user {
    padding: 20px;
    height: 100%;
  }
</style>
