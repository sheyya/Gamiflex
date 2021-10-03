
class Config {
  host;
  port;
  constructor() {
    //backend server details

    this.host = "http://gamiflexbackend-env.eba-vdpunfnp.ap-south-1.elasticbeanstalk.com/";

    this.port = "";
  }

}

var obj = new Config();
export default obj;
