<template>
    <div>
      <el-table
        :data="userData.users"
        class="manager-list"
        v-loading="loading"
      >
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <el-button :type="isAllSelected?'':'primary'" class="icon" :class="[isAllSelected?'el-icon-minus': 'el-icon-plus']" @click="toggleAllSelect"></el-button>
        </template>
        <template slot-scope="{row,$index}">
          <el-button :type="row.selected?'':'primary'" class="icon" :class="[row.selected?'el-icon-minus': 'el-icon-plus']" @click="toggleSelect(row,$index)"></el-button>
        </template>
      </el-table-column>
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
          <el-tag v-for="tag in row.tagList" :key="tag.id" style="margin: 5px">
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
        :current-page.sync="userData.curPage"
        :page-size="userData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total">
      </el-pagination>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  mounted () {
    // 初始化时获取一次用户信息
    this.getUserList()
    this.$bus.$on('releaseUser', (id) => {
      let index = this.__.findIndex(this.userData.users, (item) => {
        return item.id === id
      })
      this.userData.users[index].selected = false
      // 让数组可以更新
      this.userData.users.splice(index, 1, this.userData.users[index])
    })
  },
  props: {
    tagSelected: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 是否正在加载
      loading: false,
      // 用户数据信息
      userData: {
        // 总记录条数
        total: 0,
        // 每页的大小
        pageSize: 10,
        // 当前页码，从0开始
        curPage: 1,
        // 用户数据列表
        users: []
      }
    }
  },
  computed: {
    // 是否所有的用户都选中了
    isAllSelected () {
      let every = this.__.every(this.userData.users, (item) => {
        return item.selected
      })
      return every
    },
    ...mapState({
      selectedUserList: state => {
        return state.push.selectedUserMap
      }
    })
  },
  methods: {
    /**
     * 加载用户列表
     */
    getUserList () {
      this.loading = true
      this.api.push.getUserList(this.tagSelected,
        this.userData.curPage,
        this.userData.pageSize)
        .then(this.api.commonResp((success, data) => {
          // 当请求成功了就更新数据列表
          if (success) {
            this.userData = data
            this.userData.users.forEach((item) => {
              // 通过选中用户列表来设置是否选中
              item.selected = !(this.selectedUserList[`manager${item.id}`] === undefined || this.selectedUserList[`manager${item.id}`] == null)
            })
          } else {
            this.$message.error(data)
          }
          this.loading = false
        }))
    },
    handleSizeChange () {
    },
    handleCurrentChange () {
    },
    /**
     * 切换选中
     * @param row 行数据
     */
    toggleSelect (row, index) {
      if (row.selected) {
        this.$store.commit('push/releaseUser', row)
      } else {
        this.$store.commit('push/selectUser', row)
      }
      let manager = this.userData.users[index]
      manager.selected = !row.selected
      this.userData.users.splice(index, 1, manager)
    },
    /**
     * 切换所有的选中，若全选了就全不选，若不是全选中就全选
     */
    toggleAllSelect () {
      this.userData.users.forEach((item, index) => {
        item.selected = this.isAllSelected
        this.toggleSelect(item, index)
      })
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
