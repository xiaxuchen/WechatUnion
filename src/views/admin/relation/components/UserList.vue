<template>
  <div>
    <el-table
      :data="users"
      class="manager-list"
      v-loading="loading"
    >
      <el-table-column
        label="头像"
        width="180"
      >
        <template slot-scope="{row}">
          <el-image class="headImg" fit="cover" :src="row.headImg"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
        width="140"
      />
      <el-table-column
        prop="sex"
        label="性别"
        width="120"
      />
      <el-table-column
        prop="phone"
        label="手机号"
        width="240">
      </el-table-column>
      <el-table-column
        label="用户标签"
        min-width="200"
      >
        <template slot-scope="{row}">
          <el-tag v-for="tag in row.tags" :key="tag.id" style="margin: 5px">
            {{tag.name}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="订阅时间"
        width="240">
        <template slot-scope="{row}">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ row.subscribeTime }}</span>
        </template>
      </el-table-column>
    </el-table>
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
export default {
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
