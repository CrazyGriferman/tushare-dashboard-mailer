import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import axios from "axios";
Vue.prototype.$axios = axios;
axios.defaults.baseURL = "http://cors.crazygriferman.com"; //critical code
Vue.config.productionTip = false;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
