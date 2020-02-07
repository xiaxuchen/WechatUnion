<template>
    <div>
      <!-- 查看角色 -->
      <el-dialog title="查看角色" :visible.sync="visible" :close-on-click-modal="false">
        <el-form :model="infoForm" label-width="80px"  ref="infoForm" :inline="true">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="infoForm.username" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="id">
            <el-input v-model="infoForm.id" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form  label-width="80px" :inline="true">
          <div v-for="item in infoForm.roles" :key="item.id">
            <el-form-item label="角色名称">
              <el-input v-model="item.name" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input v-model="item.id" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  mounted () {
    this.$bus.$on('change-role-dialog', (visible, infoForm) => {
      this.infoForm = infoForm
      this.visible = visible
    })
  },
  data () {
    return {
      visible: false,
      infoForm: {}
    }
  }
}
</script>

<style scoped lang="less">

</style>
