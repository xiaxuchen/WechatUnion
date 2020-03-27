<template>
  <div>
    <user-table
      :user-list="users"
      :loading="loading"
    />
    <el-pagination
      class="fl"
      style="margin: 10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import UserTable from '@/components/UserTable'
export default {
  components: {UserTable},
  props: {
    id: Number
  },
  mounted () {
    // 初始化时获取一次用户信息
    this.loadUserList()
  },
  data () {
    return {
      // 是否正在加载
      loading: false,
      // 用户数据列表
      users: [],
      // 总记录条数
      total: 0,
      // 每页的大小
      pageSize: 10,
      // 当前页码，从0开始
      curPage: 1
    }
  },
  methods: {
    /**
       * 加载用户列表
       */
    loadUserList () {
      this.api.sysuser.getBelong(
        this.id,
        this.curPage,
        this.pageSize
      ).commonThen((success, data) => {
        // 当请求成功了就更新数据列表
        if (success) {
          this.users = data.data
          this.total = data.total
        } else {
          this.$message.error(data)
        }
        this.loading = false
      })
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.loadUserList()
    },
    handleCurrentChange (curPage) {
      this.curPage = curPage
      this.loadUserList()
    }
  }
}
</script>

<style scoped lang="less">
  .manager-list {
    min-width: 1000px;
    margin: 0 auto;
    .headImg {
      width: 64px;
      height: 64px;
    }
  }
</style>
