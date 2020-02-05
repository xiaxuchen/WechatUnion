<template>
  <div class="manager-table">
      <el-table
        :data="sysuserList"
        size="mini"
        highlight-current-row border
        class="el-tb-edit mgt20"
        v-loading="listLoading"
        @selection-change="selectChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名">
          <template slot-scope="scope">
            <el-button @click="handleSelect(scope.$index,scope.row)" type="text" size="small">{{scope.row.username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编码" />
        <el-table-column prop="roles" label="角色" >
          <template slot-scope="{row}">
            <el-tag v-for="item in row.roles" :key="item.id" style="margin: 5px;">
              {{item.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatSex" sortable />
        <el-table-column prop="state" label="是否有效" :formatter="formatState" sortable />
        <el-table-column
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  props: {
    sysuserList: {
      type: Array,
      required: true
    },
    listLoading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    selectChange (list) {
      this.$emit('select-change', list.map((item) => item.id))
    },
    // 性别显示转换
    formatSex: function (row, column) {
      return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
    },
    // 性别显示转换
    formatState: function (row, column) {
      return row.state === 1 ? '正常' : '禁用'
    },
    /**
     * 单个记录编辑事件
     */
    handleEdit (index, row) {

    },
    /**
     * 单个记录删除事件
     */
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete-manager', row.id)
      })
    }
  }
}
</script>

<style scoped lang="less">
  @leftWidth: 200px;
  .content {
    &>.left {
      float: left;
      width: @leftWidth;
    }

    &>.right {
      margin-left: @leftWidth;
    }
  }
</style>
