// user class functions
// import axios
import axios from "axios";

// import config
import Config from "./Config";

const api = {
  leavereqs: "leavereq/lreq",
  leavereqbyemp: "leavereq/lreqbyemp"
};

class LeaveReq {
  api;

  //LeaveReqs

  async getAllLeaveReqs(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.leavereqs}`, config)
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


  async getLeaveReqByID(params) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.leavereqs}/${params}`, config)
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

  async getLeaveReqByEmployee(data) {
    console.log(data);

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params: data
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.leavereqbyemp}`, config)
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

  async createLeaveReqs(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      axios.post(`${Config.host}${Config.port}${api.leavereqs}`, data, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async updateLeaveReqs(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.patch(`${Config.host}${Config.port}${api.leavereqs}/${data.id}`, data, config).then((Response) => {
        resolve(Response.data)
      })
        .catch(err => {
          reject(err)
        })
    })
  }

  async deleteLeaveReq(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.delete(`${Config.host}${Config.port}${api.leavereqs}/${data}`, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }



}
export default new LeaveReq();
