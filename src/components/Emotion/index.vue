<template>
  <div class="emotion-box" :style="{height:height + 'px'}">
    <el-row class="emotion-box-line" v-for="row in 12" :key="row">
      <el-col :span="2" class="emotion-item" v-for="num in 10"  :key="num" >
          <div @click="clickHandler(computeIndex(row,num))" v-html="emotion(computeIndex(row,num))" v-if="(computeIndex(row,num)) < 105"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      list: ['/::)', '/::~', '/::B', '/::|', '/:8-)', '/::<', '/::$', '/::X', '/::Z', "/::'(", '/::-|', '/::@', '/::P', '/::D', '/::O', '/::(', '/::+', '[囧]', '/::Q', '/::T', '/:,@P', '/:,@-D', '/::d', '/:,@o', '/::g', '/:|-)', '/::!', '/::L', '/::>', '/::,@', '/:,@f', '/::-S', '/:?', '/:,@x', '/:,@@', '/::8', '/:,@!', '/:!!!', '/:xx', '/:bye', '/:wipe', '/:dig', '/:handclap', '/:&-(', '/:B-)', '/:<@', '/:@>', '/::-O', '/:>-|', '/:P-(', "/::'|", '/:X-)', '/::*', '/:@x', '/:8*', '/:pd', '/:<W>', '/:beer', '/:basketb', '/:oo', '/:coffee', '/:eat', '/:pig', '/:rose', '/:fade', '/:showlove', '/:heart', '/:break', '/:cake', '/:li', '/:bome', '/:kn', '/:footb', '/:ladybug', '/:shit', '/:moon', '/:sun', '/:gift', '/:hug', '/:strong', '/:weak', '/:share', '/:v', '/:@)', '/:jj', '/:@@', '/:bad', '/:lvu', '/:no', '/:ok', '/:love', '/:<L>', '/:jump', '/:shake', '/:<O>', '/:circle', '/:kotow', '/:turn', '/:skip', '/:oY', '/:#-0', '/:hiphot', '/:kiss', '/:<&', '/:&>']
    }
  },
  methods: {
    computeIndex (row, col) {
      return (row - 1) * 9 + col - 1
    },
    clickHandler (i) {
      console.log(i)
      this.$emit('emotion-click', this.list[i])
    },
    emotion (index) {
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" >`
    }
  }
}
</script>

<style scoped>
  .emotion-box {
    margin: 0 auto;
    width: 95%;
    box-sizing: border-box;
    padding: 5px;
    border: 1px solid #b4b4b4;
    overflow: hidden;
    overflow-y: auto;
  }

  .emotion-box-line {
    display: flex;
  }

  .emotion-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
  }
</style>
