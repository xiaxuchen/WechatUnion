<template>
    <div class="user-list" :style="{height:height - 220 + 'px'}">
      <el-table :show-header="false"
        :data="userList"
        v-loading="loading"
        @select="handleSelectionChange"
      empty-text="暂无消息">
        <el-table-column type="selection" v-if="selectable">
          <!--<template slot-scope="scope">-->
            <!--<el-checkbox-->
              <!--@change="handleSelectionChange(scope.row)"-->
              <!--v-model="scope.row.checked"-->
            <!--/>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column prop="headImg">
          <template slot-scope="{row,$index}">
            <el-image :src="row.headImg" style="width: 50px; height: 50px"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name">
        </el-table-column>
        <el-table-column prop="lastMessage">
          <slot slot-scope="{row}">
            <span class="single-line">{{row.lastMessage?row.lastMessage.message:''}}</span>
          </slot>
        </el-table-column>
        <el-table-column prop="phone">
        </el-table-column>
        <el-table-column prop="time">
        </el-table-column>
        <el-table-column prop="agent.name"></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px"
        layout="prev, pager, next, jumper,total"
        :total="userData.total"
        :current-page="userData.curPage"
        @change-change="pageChange"
        :page-size="pageSize"
        v-show="userData.total > pageSize"
      />
    </div>
</template>

<script>
export default {
  inject: ['pageSize'],
  props: {
    height: Number,
    selectable: {
      type: Boolean,
      default: true
    },
    userData: Object,
    loading: Boolean
  },
  data () {
    return {
      selectMap: {}
    }
  },
  mounted () {

  },
  methods: {
    // 更新父组件绑定的当前页userData.curPage
    pageChange (page) {
      this.$emit('update:userData.curPage', page)
    },
    // 选择变化的时候将当前选中的传递出去
    handleSelectionChange (selection, row) {
      if (this.selectable) {
        this.selectMap[`user${row.id}`] = row
        this.$emit('select', this.selectMap)
      }
    }
  },
  computed: {
    userList () {
      return this.userData.userList.getRange()
    }
  }
}
</script>

<style scoped lang="less">
  .user-list {
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
