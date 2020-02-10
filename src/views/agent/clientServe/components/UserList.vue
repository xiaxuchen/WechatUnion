<template>
    <div class="user-list" :style="{height:height - 220 + 'px'}">
      <el-table :show-header="false"
        :data="userMessageData"
      empty-text="暂无消息">
        <el-table-column type="selection" v-if="selectable"/>
        <el-table-column prop="headImg">
          <template slot-scope="{row,$index}">
            <el-image :src="row.headImg" style="width: 50px; height: 50px"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="nickname">
        </el-table-column>
        <el-table-column prop="message">
        </el-table-column>
        <el-table-column prop="phone">
        </el-table-column>
        <el-table-column prop="time">
        </el-table-column>
        <el-table-column prop="agent.name"></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px"
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="5"
        v-show="total > 5"
      />
    </div>
</template>

<script>
export default {
  props: {
    height: Number,
    selectable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      total: 6,
      userMessageData: [{
        headImg: 'https://timgsa.baidu.com/timg?image&amp;amp;amp;amp;amp;amp;quality=80&amp;amp;amp;amp;amp;amp;size=b9999_10000&amp;amp;amp;amp;amp;amp;sec=1579165101420&amp;amp;amp;amp;amp;amp;di=15b492e796aaf49d330fc00929bf4e7b&amp;amp;amp;amp;amp;amp;imgtype=jpg&amp;amp;amp;amp;amp;amp;src=http%3A%2F%2Fimg2.touxiang.cn%2Ffile%2F20171113%2Fb213c1ac58be0e02906ea1424781b31b.jpg',
        nickname: '嘿',
        time: '2018-10-11 08:10',
        message: '你好啊',
        phone: '17779911413',
        agent: {
          id: 1000,
          name: 'xxc'
        }
      }, {
        headImg: 'https://timgsa.baidu.com/timg?image&amp;amp;amp;amp;amp;amp;quality=80&amp;amp;amp;amp;amp;amp;size=b9999_10000&amp;amp;amp;amp;amp;amp;sec=1579165101420&amp;amp;amp;amp;amp;amp;di=15b492e796aaf49d330fc00929bf4e7b&amp;amp;amp;amp;amp;amp;imgtype=jpg&amp;amp;amp;amp;amp;amp;src=http%3A%2F%2Fimg2.touxiang.cn%2Ffile%2F20171113%2Fb213c1ac58be0e02906ea1424781b31b.jpg',
        nickname: '嘿',
        time: '2018-10-11 08:10',
        message: '你好啊',
        phone: '17779911413',
        agent: {
          id: 1000,
          name: 'xxc'
        }
      }, {
        headImg: 'https://timgsa.baidu.com/timg?image&amp;amp;amp;amp;amp;amp;quality=80&amp;amp;amp;amp;amp;amp;size=b9999_10000&amp;amp;amp;amp;amp;amp;sec=1579165101420&amp;amp;amp;amp;amp;amp;di=15b492e796aaf49d330fc00929bf4e7b&amp;amp;amp;amp;amp;amp;imgtype=jpg&amp;amp;amp;amp;amp;amp;src=http%3A%2F%2Fimg2.touxiang.cn%2Ffile%2F20171113%2Fb213c1ac58be0e02906ea1424781b31b.jpg',
        nickname: '嘿',
        time: '2018-10-11 08:10',
        message: '你好啊',
        phone: '17779911413',
        agent: {
          id: 1000,
          name: 'xxc'
        }
      }, {
        headImg: 'https://timgsa.baidu.com/timg?image&amp;amp;amp;amp;amp;amp;quality=80&amp;amp;amp;amp;amp;amp;size=b9999_10000&amp;amp;amp;amp;amp;amp;sec=1579165101420&amp;amp;amp;amp;amp;amp;di=15b492e796aaf49d330fc00929bf4e7b&amp;amp;amp;amp;amp;amp;imgtype=jpg&amp;amp;amp;amp;amp;amp;src=http%3A%2F%2Fimg2.touxiang.cn%2Ffile%2F20171113%2Fb213c1ac58be0e02906ea1424781b31b.jpg',
        nickname: '嘿',
        time: '2018-10-11 08:10',
        message: '你好啊',
        phone: '17779911413',
        agent: {
          id: 1000,
          name: 'xxc'
        }
      }, {
        headImg: 'https://timgsa.baidu.com/timg?image&amp;amp;amp;amp;amp;amp;quality=80&amp;amp;amp;amp;amp;amp;size=b9999_10000&amp;amp;amp;amp;amp;amp;sec=1579165101420&amp;amp;amp;amp;amp;amp;di=15b492e796aaf49d330fc00929bf4e7b&amp;amp;amp;amp;amp;amp;imgtype=jpg&amp;amp;amp;amp;amp;amp;src=http%3A%2F%2Fimg2.touxiang.cn%2Ffile%2F20171113%2Fb213c1ac58be0e02906ea1424781b31b.jpg',
        nickname: '嘿',
        time: '2018-10-11 08:10',
        message: '你好啊',
        phone: '17779911413',
        agent: {
          id: 1000,
          name: 'xxc'
        }
      }]
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
