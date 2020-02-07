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
      @update-user="onUpdateUser"
    />
    <!-- 分页 -->
    <div style="margin-top: 20px">
      <el-pagination
        @size-change = "onSizeChange"
        @current-change="onPageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper, total"
        :total="total" />
    </div>
    <add-sys-user-dialog @add-user="onAddUser"/>
  </div>
</template>
<script>
import SearchBar from './components/SearchBar'
import ManagerTable from './components/ManagerTable'
import AddSysUserDialog from './components/AddSysUserDialog'
export default {
  mounted () {
    // 初始加载用户信息
    this.loadUserList()
  },
  components: {
    SearchBar,
    ManagerTable,
    AddSysUserDialog
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
      pageSize: 10,
      // 筛选
      filter: {}
    }
  },
  methods: {
    onAddUser (user) {
      this.$bus.$emit('show-loading-dialog')
      this.api.sysuser.addSysuser(user)
        .then(this.api.commonResp((success, data) => {
          if (success) {
            this.$message('添加成功')
            this.$bus.$emit('change-add-sys-dialog', false)
          } else {
            this.$message.error('添加失败:' + data)
          }
        })).finally(() => {
          this.$bus.$emit('hide-loading-dialog')
        })
    },
    onUpdateUser (user) {
      this.api.sysuser.updateUser(user)
        .then(this.api.commonResp((success, data) => {
          if (success) {
            this.$message('保存成功')
            this.$bus.$emit('change-edit-sys-dialog', false)
          } else {
            this.$message.error('保存失败:' + data)
          }
        })).finally(() => {
          this.$bus.$emit('hide-loading-dialog')
        })
    },
    // 筛选用户信息
    onSearch (filter) {
      this.filter = {}
      Object.keys(filter).forEach((key) => {
        let value = filter[key]
        if (value) { this.filter[key] = value }
      })
      this.loadUserList()
    },
    onPageChange (page) {
      this.curPage = page
      this.loadUserList()
    },
    onSizeChange (size) {
      this.pageSize = size
      this.loadUserList()
    },
    deleteSelectedManagers () {
      if (this.selectedUserIds.length === 0) {
        this.$message.error('您还没有选择待删除的用户')
        return
      }
      this.$confirm('此操作将永久删除这些用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteManagers(this.selectedUserIds)
      })
    },
    deleteManagers (ids) {
      this.$bus.$emit('show-loading-dialog')
      this.api.sysuser.deleteSysusers(ids)
        .then(this.api.commonResp((success, data) => {
          if (success) {
            this.$message('删除成功')
            this.loadUserList()
          } else {
            this.$message.error('删除失败:' + data)
          }
        })).finally(() => {
          this.$bus.$emit('hide-loading-dialog')
        })
    },
    addManager () {
      this.$bus.$emit('show-add-sys-dialog')
    },
    onManagerSelectChange (ids) {
      this.selectedUserIds = ids
    },
    loadUserList () {
      this.listLoading = true
      this.api.sysuser
        .getSysUserList({
          curPage: this.curPage,
          pageSize: this.pageSize,
          ...this.filter
        })
        .then(this.api.commonResp((success, data) => {
          if (success) {
            this.sysuserList = data.users
            this.total = data.total
          } else {
            this.$message.error(data)
          }
        })).finally(() => {
          this.listLoading = false
        })
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
