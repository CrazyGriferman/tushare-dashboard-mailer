export const getChartOption = (stockPrice, xDate) => {
  let chartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: xDate,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: stockPrice,
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  return chartOption;
};
