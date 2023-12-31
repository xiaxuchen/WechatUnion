<template>
  <div>
    <div>
      <el-button class="fr" type="primary" size="mini" @click="showUploadExcelDialog"><b class="el-icon-receiving"></b> excel导入</el-button>
    </div>
    <el-table
      :data="userData.users"
      class="manager-list"
      :v-loading="loading"
    >
      <el-table-column width="100">
        <template slot="header" slot-scope="scope" v-if="selectedSize !== 0">
          <el-button  class="icon el-icon-minus" @click="toggleAllSelect"></el-button>
        </template>
        <template slot-scope="{row,$index}">
          <el-button :type="row.selected?'':'primary'" class="icon" :class="[row.selected?'el-icon-minus': 'el-icon-plus']" @click="releaseUser(row,$index)"></el-button>
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
          <span style="margin-left: 10px">{{ row.subscribeTime | formatTimeInMillis }}</span>
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
    <bottom-button-dialog :visible.sync="uploadDialogVisible" :bottom-visible="false">
      <template slot="title">
        <h2>excel导入</h2>
      </template>
      <template>
        <div align="center">
          <upload :action="excelUploadAction"
                  :model-action="modelAction"
                  :on-success="addUsersToList"
          />
        </div>
      </template>
    </bottom-button-dialog>
  </div>
</template>

<script>
import BottomButtonDialog from '@/components/BottomButtonDialog'
import {mapState} from 'vuex'
import Upload from '@/components/Upload'
export default {
  mounted () {
    this.userData.total = this.selectedSize
  },
  data () {
    return {
      userData: {
        total: 0,
        pageSize: 10,
        curPage: 1,
        users: []
      },
      uploadDialogVisible: false,
      excelUploadAction: this.api.baseURL + '/push/users/excel',
      modelAction: this.api.baseURL + '/resource/template/phone',
      headers: {Authorization: this.$store.state.manager.token},
      loading: false
    }
  },
  computed: {
    ...mapState({
      selectedSize: state => state.push.selectedSize
    })
  },
  watch: {
    selectedSize: {
      handler () {
        this.update()
      },
      immediate: true
    }
  },
  methods: {
    update () {
      this.loading = true
      this.userData.users = this.getSelectedUserList()
      this.userData.total = this.selectedSize
      this.loading = false
    },
    handleCurrentChange () {
      this.update()
    },
    handleSizeChange (size) {
      this.userData.pageSize = size
      this.update()
    },
    addUsersToList (response) {
      if (response.success) {
        this.$store.commit('push/addUsers', response.data)
        this.uploadDialogVisible = false
        this.$message('导入成功')
      } else {
        this.$message.error(response.msg)
      }
    },
    showUploadExcelDialog () {
      this.uploadDialogVisible = true
    },
    getSelectedUserList () {
      let list = []
      Object.keys(this.$store.state.push.selectedUserMap).forEach((key) => {
        let value = this.$store.state.push.selectedUserMap[key]
        if (value) {
          list.push(value)
        }
      })
      let {pageSize, curPage} = this.userData
      // 将list截取当前页的数据
      return list.slice((curPage - 1) * pageSize, curPage * pageSize)
    },
    /**
     * 切换选中
     * @param row 行数据
     */
    releaseUser (row) {
      if (row.selected) {
        this.$store.commit('push/releaseUsers', [row])
        this.$bus.$emit('releaseUser', row.id)
      } else {
        this.$store.commit('push/addUsers', [row])
      }
    },
    /**
     * 切换所有的选中，若全选了就全不选，若不是全选中就全选
     */
    toggleAllSelect () {
      this.$store.commit('push/releaseUsers', this.userData.users)
      this.userData.users.forEach(user => {
        this.$bus.$emit('releaseUser', user.id)
      })
    }
  },
  components: {
    Upload,
    BottomButtonDialog
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
