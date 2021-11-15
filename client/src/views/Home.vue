[proxychains] DLL init: proxychains-ng 4.14 [proxychains] DLL init:
proxychains-ng 4.14
<template>
  <div id="stock">
    <city-the-chart
      @clickStation="changeInfo"
      v-if="isChartRender"
      :chartOption="chartOption"
    />
    <form
      ref="subscribe_form"
      id="subscribe"
      method="post"
      @submit.prevent="subscribeSubmit"
      action=""
    >
      <input
        type="text"
        placeholder="请填入股票代码"
        v-model="subscriber.stockNumber"
      />
      <input
        type="text"
        placeholder="填入抄底价格"
        v-model="subscriber.stockPrice"
      />
      <input
        type="text"
        placeholder="请填入订阅密钥"
        v-model="subscriber.key"
      />
      <button type="submit">订阅</button>
    </form>

    <form id="search" action="">
      <head>
        股票查询窗口
      </head>
      <input type="text" placeholder="请填入股票代码" />
      <input type="date" placeholder="起始日期" />
      <input type="date" placeholder="终止日期" />
      <button type="submit">查询</button>
    </form>
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
      subscriber: {
        stockNumber: "",
        stockPrice: "",
        key: "",
      },
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
          end_date: "20211110",
        },
        fields: "trade_date,close",
      })
      .then((res) => {
        this.data = res.data.data.items;
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
    /* axios */
    /*   .post("/test", { */
    /*     data: this.chartSetting["stcokPrice"], */
    /*   }) */
    /*   .then(() => { */
    /*     console.log(1); */
    /*   }); */
  },
  methods: {
    changeInfo() {
      console.log(1);
    },
    subscribeSubmit() {
      this.$refs.subscribe_form.reset();
      console.log(this.subscriber.stockPrice);
    },
  },
};
</script>

<style scoped>
#stationChart {
  position: absolute;
  bottom: 5%;
  left: 7%;
}

#subscribe {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 6%;
  left: 5%;
}

#subscribe input {
  border: #032d60;
  font-size: 24px;
  color: #a4c338;
  width: 100%;
  height: 3%;
  background: #032d60;
}

#subscribe input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #a4c338;
}

#subscribe button {
  cursor: pointer;
  background-color: #5470c6;
  height: 3vh;
  font-size: 24px;
  color: #a4c338;
}

#search {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 5%;
  top: 6%;
}

#search input {
  border: #032d60;
  font-size: 24px;
  color: #a4c338;
  width: 100%;
  height: 3%;
  background: #032d60;
}

#search input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #a4c338;
}

#search input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

#search button {
  cursor: pointer;
  background-color: #5470c6;
  height: 3vh;
  font-size: 24px;
  color: #a4c338;
}
</style>
