<template>
  <form id="baseFrom" action="">
    <input type="text" placeholder="请填入股票代码" />
    <input type="text" placeholder="填入抄底价格" />
    <input type="text" placeholder="请填入订阅密钥" />
    <button type="submit">订阅</button>
  </form>
</template>

<script>
export default {
  name: "Form",
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

<style scoped>
#baseForm {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 6%;
  left: 5%;
}

#baseForm input {
  border: #032d60;
  font-size: 24px;
  color: #a4c338;
  width: 100%;
  height: 3%;
  background: #032d60;
}

#baseForm input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #a4c338;
}

#baseForm button {
  cursor: pointer;
  background-color: #5470c6;
  height: 3%;
  font-size: 24px;
  color: #a4c338;
}
</style>
