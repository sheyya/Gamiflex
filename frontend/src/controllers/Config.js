
class Config {
  host;
  port;
  constructor() {
    //backend server details
    // https://gamiflex-server.tinykiddies.com/
    this.host = "http://localhost";

    this.port = ":5000/";
  }

}

var obj = new Config();
export default obj;
