<template>
    <div class="material-dialog">
      <el-dialog :visible="visible" title="选择素材" width="60%" @close="close">
          <div class="item-list" v-loading="loading">
            <material-item class="fl" v-for="item in materialList" :key="item.id" :material="item" @select="setMaterialID(item.id)"></material-item>
          </div>
      </el-dialog>
    </div>
</template>

<script>
import MaterialItem from './MaterialItem'
export default {
  mounted () {
    this.$bus.$on('show-material-dialog', () => {
      this.visible = true
      // 显示的时候加载素材列表
      this.loadMaterialList()
    })
  },
  data () {
    return {
      curPage: 0,
      pageSize: 10,
      visible: false,
      loading: false,
      materialList: []
    }
  },
  components: {
    MaterialItem
  },
  methods: {
    close () {
      this.visible = false
    },
    setMaterialID (id) {
      this.close()
      this.$emit('on-check-material', id)
    },
    /***
     * 加载素材列表
     */
    loadMaterialList () {
      this.loading = true
      this.api.push.getMaterialList(this.curPage, this.pageSize).then(this.api.commonResp((success, data) => {
        if (success) {
          this.materialList = data
          console.log(JSON.stringify(data))
        } else {
          this.$message.error(data)
        }
        this.loading = false
      }))
    }
  }
}
</script>

<style scoped lang="less">
  .material-dialog {
    background: white;
    .item-list {
      display: block;
      height: 400px;
      overflow-y: scroll;
    }
  }
</style>
