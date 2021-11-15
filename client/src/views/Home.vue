[proxychains] DLL init: proxychains-ng 4.14 [proxychains] DLL init:
proxychains-ng 4.14
<template>
  <div id="stock">
    <city-the-chart
      @clickStation="changeInfo"
      v-if="isChartRender"
      :chartOption="chartOption"
      :postData="postData"
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

    <form
      id="search"
      @submit.prevent="searchSubmit"
      method="post"
      ref="search_form"
    >
      <head>
        股票查询窗口
      </head>
      <input
        type="text"
        placeholder="请填入股票代码"
        v-model="searchData.stockNumber"
      />
      <input
        type="date"
        placeholder="起始日期"
        v-model="searchData.startDate"
      />
      <input type="date" placeholder="终止日期" v-model="searchData.endDate" />
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
      searchData: {
        stockNumber: "",
        startDate: "",
        endDate: "",
      },
      data: [],
      isChartRender: false,
      chartSetting: {
        stcokPrice: [],
        xDate: [],
      },
      chartOption: [],
      chartData: [],
      postData: {
        ts_code: "600009.SH",
        start_date: "20200916",
        end_date: "20211110",
      },
    };
  },
  watch: {
    postData: {
      handler(newPostData, oldPostData) {
        this.isChartRender = false;
        axios
          .post("/", {
            api_name: "daily",
            token: "f65ba28a7e38e1aa626a720bfa27a7ce1a2d8b14216ad2fc1f44946d",
            params: {
              ts_code: newPostData.ts_code,
              start_date: newPostData.start_date,
              end_date: newPostData.end_date,
            },
            fields: "trade_date,close",
          })
          .then((res) => {
            this.data = res.data.data.items;
            this.chartSetting["xDate"] = [];
            this.chartSetting["stcokPrice"] = [];
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
      immediate: true,
      deep: true,
    },
  },
  async created() {},

  methods: {
    changeInfo() {
      console.log(1);
    },
    subscribeSubmit() {
      this.$refs.subscribe_form.reset();
    },
    searchSubmit() {
      this.searchData.startDate = this.searchData.startDate.replace(/\-/g, "");
      this.searchData.endDate = this.searchData.endDate.replace(/\-/g, "");
      this.$refs.search_form.reset();
      this.postData.ts_code = this.searchData.stockNumber;
      this.postData.start_date = this.searchData.startDate;
      this.postData.end_date = this.searchData.endDate;
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
  height: 2em;
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
  height: 2em;
  font-size: 24px;
  color: #a4c338;
}
</style>
