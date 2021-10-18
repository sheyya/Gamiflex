
class Config {
  host;
  port;
  constructor() {
    //backend server details
    // https://gamiflex-server.tinykiddies.com/
    this.host = "https://gamiflex-server.tinykiddies.com/";

    this.port = "";
  }

}

var obj = new Config();
export default obj;
