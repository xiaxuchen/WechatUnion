<template>
    <div>
      <el-table
        :data="userList"
        class="user-table"
        v-loading="loading"
        @select="onSelectChange"
      >
        <el-table-column v-if="selectable" :selectable="true" />
        <el-table-column
          label="头像"
          width="120"
        >
          <template slot-scope="{row}">
            <el-image class="headImg" fit="cover" :src="row.headImg"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="昵称"
          width="120"
        />
        <el-table-column
          prop="sex"
          label="性别"
          width="80"
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
            <span style="margin-left: 10px">{{ row.subscribeTime | formatTimeInMillis }}</span>
          </template>
        </el-table-column>
        <slot name="tail"></slot>
      </el-table>
    </div>
</template>

<script>
export default {
  /**
   * userList结构: [{
   *     headImg: 头像,
   *     name: 昵称,
   *     sex: 性别,
   *     phone: 电话号码,
   *     tags: 用户的标签,
   *     subscribeTime: 订阅时间,
   *     id: 用户id
   * }]
   */
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    selectable: Boolean,
    userList: {
      type: Array
    }
  },
  methods: {
    onSelectChange (selection, row) {
      this.$emit('select', selection, row)
    }
  }
}
</script>

<style scoped lang="less">
  .user-table {
    margin: 0 auto;
    .headImg {
      width: 64px;
      height: 64px;
    }
  }
</style>
