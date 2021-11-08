[proxychains] DLL init: proxychains-ng 4.14 [proxychains] DLL init:
proxychains-ng 4.14
<template>
  <div id="stock">
    <city-the-chart
      @clickStation="changeInfo"
      v-if="isChartRender"
      :chartOption="chartOption"
    />
  </div>
</template>

<script>
import axios from "axios";
import { getChartOption } from "../utils/GetChartOption";
import CityTheChart from "../components/CityTheChart";

export default {
  name: "Home",
  components: {
    CityTheChart,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      data: [],
      isChartRender: false,
      chartSetting: {
        stcokPrice: [],
        xDate: [],
      },
      chartOption: [],
      chartData: [],
    };
  },
  async created() {
    await axios
      .post("/", {
        api_name: "daily",
        token: "f65ba28a7e38e1aa626a720bfa27a7ce1a2d8b14216ad2fc1f44946d",
        params: {
          ts_code: "600009.SH",
          start_date: "20200916",
          end_date: "20211102",
        },
        fields: "trade_date,close",
      })
      .then((res) => {
        this.data = res.data.data.items;
        console.log(this.data);
        this.data.forEach((item) => {
          this.chartSetting["xDate"].push(item[0]);
          this.chartSetting["stcokPrice"].push(item[1]);
        });
        this.chartSetting["stcokPrice"] =
          this.chartSetting["stcokPrice"].reverse();
        this.chartSetting["xDate"] = this.chartSetting["xDate"].reverse();
        this.chartOption = getChartOption(
          this.chartSetting["stcokPrice"],
          this.chartSetting["xDate"]
        );
        this.isChartRender = true;
      });
  },
  methods: {
    changeInfo() {
      console.log(1);
    },
  },
};
</script>

<style scoped>
#stationChart {
  position: absolute;
  top: 10%;
  left: 7%;
}
</style>
