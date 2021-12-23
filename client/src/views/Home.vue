[proxychains] DLL init: proxychains-ng 4.14 [proxychains] DLL init:
proxychains-ng 4.14
<template>
  <div id="stock">
    <city-the-chart
      @clickStation="changeInfo"
      v-if="isChartRender"
      :chartOption="chartOption"
      :postData="postData"
      :chartTitleName="chartTitleName"
    />
    <form
      ref="subscribe_form"
      id="subscribe"
      method="post"
      @submit.prevent=""
      action=""
    >
      <input
        type="text"
        placeholder="请填入股票名称"
        v-model="subscriber.stockName"
      />

      <input
        type="text"
        placeholder="填入价格"
        v-model="subscriber.stockPrice"
      />
      <input
        type="text"
        placeholder="请填入订阅邮箱"
        v-model="subscriber.mail"
      />
      <button type="submit" @click="subscribeSubmit('subscribe')">订阅</button>
      <button type="submit" @click="subscribeSubmit('delete')">删除</button>
    </form>

    <form
      id="search"
      @submit.prevent="searchSubmit(searchStockName)"
      method="post"
      ref="search_form"
    >
      <head>
        股票查询窗口
      </head>
      <div class="stockName">
        <input
          type="text"
          placeholder="请填入股票名称"
          v-model="searchStockName"
        />
        <div class="suggestion">
          <ul>
            <li v-for="result in results" :key="result.id">
              <a href="#" @click="setResult(result)">{{ result }}</a>
            </li>
          </ul>
        </div>
      </div>

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
import baseUrl from "../api/baseUrl";
import corsUrl from "../api/corsUrl";

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
      stockRawData: "",
      searchString: "",
      results: [],
      stockMap: "",
      chartTitleName: "上海机场",
      subscriber: {
        stockNumber: "",
        stockName: "",
        stockPrice: "",
        mail: "",
      },
      searchStockName: "",
      searchData: {
        stockNumber: "",
        startDate: "",
        endDate: "",
      },
      data: [],
      isChartRender: false,
      chartSetting: {
        stockPrice: [],
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
          .post(`${corsUrl}/http://api.waditu.com/`, {
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
            this.chartSetting["stockPrice"] = [];
            this.data.forEach((item) => {
              this.chartSetting["xDate"].push(item[0]);
              this.chartSetting["stockPrice"].push(item[1]);
            });
            this.chartSetting["stockPrice"] =
              this.chartSetting["stockPrice"].reverse();
            this.chartSetting["xDate"] = this.chartSetting["xDate"].reverse();
            this.chartOption = getChartOption(
              this.chartSetting["stockPrice"],
              this.chartSetting["xDate"]
            );
            this.isChartRender = true;
          });
      },
      immediate: true,
      deep: true,
    },
    searchStockName: {
      handler(newSearchStockName, oldSearchStockName) {
        this.search(newSearchStockName, this.results);
      },
    },
  },
  async created() {
    await axios.get(`./static/stock.json`).then((res) => {
      this.stockRawData = res.data.items;
      let stockMap = new Map();
      this.stockRawData.forEach((item) => {
        stockMap.set(item[1], item[0]);
      });
      this.stockMap = stockMap;
    });
  },
  methods: {
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // 拼接
      return year + "" + month + "" + day;
    },
    setResult(text) {
      this.searchStockName = text;
      this.results = [];
    },
    search(stockName) {
      this.results = [];
      if (stockName) {
        this.stockMap.forEach((key, value) => {
          if (value.indexOf(stockName) != -1) {
            this.results.push(value);
          }
        });
      }
    },
    changeInfo() {
      console.log(1);
    },
    subscribeSubmit(choice) {
      if (choice == "subscribe") {
        axios
          .post(`${baseUrl}/add`, {
            data: {
              stockNumber: this.stockMap.get(this.subscriber.stockName),
              stockName: this.subscriber.stockName,
              stockPrice: this.subscriber.stockPrice,
              mail: this.subscriber.mail,
            },
          })
          .then((res) => {});
        this.subscriber.stockNumber = "";
        this.subscriber.stockName = "";
        this.subscriber.stockPrice = "";
        this.subscriber.mail = "";
      } else if (choice == "delete") {
        axios
          .post(`${baseUrl}/delete`, {
            data: {
              stockName: this.subscriber.stockName,
              stockPrice: undefined ? null : this.subscriber.stockPrice,
              mail: this.subscriber.mail,
            },
          })
          .then((res) => {});
        this.subscriber.stockNumber = "";
        this.subscriber.stockName = "";
        this.subscriber.stockPrice = "";
        this.subscriber.mail = "";
      }
      this.$refs.subscribe_form.reset();
    },
    searchSubmit(stockName) {
      this.chartTitleName = stockName;
      this.searchData.startDate = this.searchData.startDate.replace(/\-/g, "");
      this.searchData.endDate = this.searchData.endDate.replace(/\-/g, "");
      this.$refs.search_form.reset();
      this.postData.ts_code = this.stockMap.get(stockName);
      this.postData.start_date = this.searchData.startDate;
      this.postData.end_date = this.searchData.endDate;
    },
  },
};
</script>

<style scoped>
#stationChart {
  position: absolute;
  bottom: 3%;
  left: 10%;
}

#subscribe {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0%;
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
  top: 0%;
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

.stockName {
  position: relative;
}

.suggestion {
  margin: 0;
  color: red;
}

.suggestion ul {
  position: absolute;
  width: 100%;
  padding: 0;
  margin: 0;
  color: red;
}

.suggestion li {
  list-style: none;
}

.suggestion li a {
  font-size: 24px;
  display: block;
  opacity: 0.9;
  text-decoration: none;
  color: #a4c338;
  background-color: #fff;
}
</style>
