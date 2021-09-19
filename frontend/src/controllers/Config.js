
class Config {
  host;
  port;
  constructor() {
    //backend server details

    this.host = "https://gamiflex-backend2.azurewebsites.net/";

    this.port = "";
  }

}

var obj = new Config();
export default obj;
