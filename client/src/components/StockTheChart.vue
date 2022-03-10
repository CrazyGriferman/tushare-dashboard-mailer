<script>
import * as echarts from "echarts";
import BaseContainer from "../features/BaseContainer.vue";
export default {
  name: "StockTheChart",
  components: { BaseContainer },
  props: ["chartOption", "postData", "chartTitleName"],
  mounted() {
    let Chart = echarts.init(document.getElementById("chart"));
    Chart.setOption(this.chartOption);
    Chart.on("click", () => {
      this.$emit("clickStation");
    });
    window.addEventListener("resize", () => {
      Chart.resize();
    });
  },
};
</script>

<template>
  <base-container
    id="stockChart"
    :ititle="`${this.chartTitleName}日线 ${this.postData.start_date} 至 ${this.postData.end_date}`"
    iwidth="80"
    iheight="70"
    hasLink="no"
  >
    <div id="chart"></div>
  </base-container>
</template>

<style>
#chart {
  position: absolute;
  top: 10%;
  left: 3%;
  width: 100%;
  height: 100%;
}
</style>
