let baseUrl = "";
switch (process.env.NODE_ENV) {
  case "development":
    baseUrl = "http://localhost:8085"; //开发环境url
    break;
  case "production":
    baseUrl = "http://localhost:8089/"; //生产环境url
    break;
}

export default baseUrl;
