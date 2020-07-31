<template>
   <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
    <div class="message d-flex justify-content-center">
      {{message}}
    </div>
    <p>x1:<input v-model="point.x1" type="number"></p>
    <p>y1:<input v-model="point.y1" type="number"></p>
    <p>x2:<input v-model="point.x2" type="number"></p>
    <p>y2<input v-model="point.y2" type="number"></p>
    <p>x3:<input v-model="point.x3" type="number"></p>
    <p>y3:<input v-model="point.y3" type="number"></p>

    <button @click="addTriangle">追加</button>
  </div>
</template>

<script>
  if (process.browser) {
    // var radar = require('../lib/Radar')
    var triangle = require('../lib/Triangle')
  }
  export default {
    data() {
      return {
        message: "",
        point: {
          x1: null,
          y1: null,
          x2: null,
          y2: null,
          x3: null,
          y3: null
        }
      }
    },
    mounted() {
      const P5 = require('p5')
      // new P5(radar.main)
      // new P5(triangle.main)
      triangle.main(new P5())
      // NOTE: p5.jsからのコールバックを受け取る
      // radar.setDelegate(this.callbackOnP5);
    },
    methods: {
      callbackOnP5: function(timeStr) {
        this.message = timeStr;
      },
      addTriangle() {
        // const {x1, x2, x3, y1, y2, y3} = this.point
        console.log('add')
      }
    }
  }
</script>

<style>
.message {
  color: black;
}
</style>