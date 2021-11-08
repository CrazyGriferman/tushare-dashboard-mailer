<script>
export default {
  name: "Container",
  props: {
    iwidth: {
      type: String,
      require: true,
    },
    iheight: {
      type: String,
      require: true,
    },
    ititle: {
      type: String,
      require: false,
      default: null,
    },
    hasLink: {
      type: String,
      require: true,
      default: null,
    },
    ilink: {
      type: String,
      require: false,
      default: null,
    },
    itext: {
      type: String,
      require: false,
      default: null,
    },
  },
  data() {
    return {
      containerStyle: {
        width: this.iwidth + "%",
        height: this.iheight + "%",
      },
    };
  },
};
</script>

<template>
  <div class="container" :style="containerStyle">
    <i class="topL"></i>
    <i class="topR"></i>
    <i class="bottomL"></i>
    <i class="bottomR"></i>
    <div class="container-title">
      <b class="container-title-left">[</b>
      <span v-if="hasLink === 'no'" class="container-title-content">{{
        ititle
      }}</span>
      <a
        v-else-if="hasLink === 'yes'"
        class="container-title-content"
        :href="ilink"
        :title="itext"
        >{{ ititle }}</a
      >
      <b class="container-title-right">]</b>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  border: 2px solid #032d60;
  box-shadow: inset 0 0 30px #07417a;
  position: absolute;
}
.topL {
  width: 20px;
  height: 20px;
  border-top-width: 2px;
  border-top-color: #26c6f0;
  border-top-style: solid;
  border-left-width: 2px;
  border-left-color: #26c6f0;
  border-left-style: solid;
  position: absolute;
  top: -2px;
  left: -2px;
}
.topR {
  width: 20px;
  height: 20px;
  border-top-width: 2px;
  border-top-color: #26c6f0;
  border-top-style: solid;
  border-right-width: 2px;
  border-right-color: #26c6f0;
  border-right-style: solid;
  position: absolute;
  top: -2px;
  right: -2px;
}
.bottomL {
  width: 20px;
  height: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #26c6f0;
  border-bottom-style: solid;
  border-left-width: 2px;
  border-left-color: #26c6f0;
  border-left-style: solid;
  position: absolute;
  bottom: -2px;
  left: -2px;
}
.bottomR {
  width: 20px;
  height: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #26c6f0;
  border-bottom-style: solid;
  border-right-width: 2px;
  border-right-color: #26c6f0;
  border-right-style: solid;
  position: absolute;
  bottom: -2px;
  right: -2px;
}

.container-title {
  background-color: #000c3b;
  margin: -18px auto 0 auto;
  color: #a4c338;
  font-weight: bold;
  font-size: 20px;
  width: 80%;
  display: flex;
  justify-content: space-between;
}

.container-title-left,
.container-title-right {
  color: #105eda;
  font-family: "微软雅黑";
  font-size: 20px;
}

.container-title-content {
  text-align: center;
  display: inline-block;
  font-size: 18px;
  height: 20px;
  overflow: hidden;
  min-height: 26px;
}

.container-title a {
  color: #fff;
  text-decoration: none;
}

.container-title a:visited {
  color: #fff;
}

.container-title a:active {
  color: #fff;
}
</style>
