// user class functions
// import axios
import axios from "axios";

// import config
import Config from "./Config";

const api = {
  tctot: "datalog/tctot",
  marksbyemp: "datalog/marksbyemp"
};

class Datalog {
  api;

  //Datalogs

  async getAllDatalogs(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.tctot}`, config)
        .then(result => {
          if (result.status === 200) {
            resolve(result.data)

          } else {
            resolve([])

          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }


  async getMarksByEmployee(data) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params: data
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.marksbyemp}`, config)
        .then(result => {
          if (result.status === 200) {
            resolve(result.data)

          } else {
            resolve([])

          }
        })
        .catch(err => {
          reject(err)
        })

    })
  }


}
export default new Datalog();
