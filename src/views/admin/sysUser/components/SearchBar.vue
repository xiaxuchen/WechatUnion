<template>
  <div class="search-bar">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        姓名  ： <el-input v-model="filters.name"  placeholder="姓名" style="width:200px; heght:30px;" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        编码 ：<el-input v-model="filters.userId"   placeholder="编码" style="width:200px; heght:30px;" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        角色 ：
        <el-select v-model="filters.roleId" placeholder="请选择" clearable size="mini">
          <el-option  v-for="item in roleOptions"   :key="item.id"  :label="item.name"  :value="item.id" ></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item>
        用户名：<el-input v-model="filters.userName"   placeholder="用户名" style="width:200px; heght:30px;" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        手机：<el-input v-model="filters.mobile"   placeholder="手机" style="width:200px; heght:30px;" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        性别：
        <el-select v-model="filters.sex" placeholder="请选择" clearable size="mini">
          <el-option  v-for="item in sexOptions"   :key="item.value"  :label="item.label"  :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick" size="mini">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filters: {
        name: '',
        userName: '',
        userId: '',
        mobile: '',
        sex: '',
        roleId: null
      },
      // 角色信息
      roleOptions: [],
      // 性别下拉框
      sexOptions: [
        {
          value: '1',
          label: '男'
        },
        {
          value: '0',
          label: '女'
        }
      ]
    }
  },
  methods: {
    searchClick () {
      this.$emit('search', this.filters)
    }
  }
}
</script>

<style scoped lang="less">

</style>
