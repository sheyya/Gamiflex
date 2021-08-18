// user class functions
// import axios
import axios from "axios";

// import config
import Config from "./Config";

const api = {
  signin: "admin/signin",
  employees: "admin/emp",
  managers: "admin/mngr",
  empsalary: "empsalary/empsalary",
  empsalarybyemp: "empsalary/empsalarybyemp",
};

class Admin {
  api;

  //Users Sign In
  async userSignIn(username, password) {
    var requestData = {
      username: username,
      password: password,
    };
    var userData = {};
    var resp = 600;
    await axios.post(`${Config.host}${Config.port}${api.signin}`, requestData)
      .then(
        (Response) => {
          resp = Response.data;
          userData = Response.data.success;
          localStorage.setItem("usertoken", Response.data.token);
        }
      )
      .catch((err) => {
        console.error(err);
        try {
          console.error(err);
          resp = err.response.status;
        } catch (error) {
          resp = 600;
        }
      });

    if (resp === 200) {
      return userData;
    }
    return resp;
  }

  userLogout() {
    localStorage.removeItem("usertoken");
    window.location.replace('/home')
  }

  getCurrentUser() {
    const token = localStorage.getItem("usertoken");
    let isUser;
    if (token) {
      isUser = true;
    } else {
      isUser = false;
    }
    return isUser;
  }

  // async createPlatformUser(data) {
  //   const config = {
  //     headers: { Authorization: `${localStorage.getItem("usertoken")}` },
  //   };
  //   await axios.post(
  //     `${Config.host}${Config.port}${api.platformusers}`,
  //     data,
  //     config
  //   )
  //     .then((Response) => {
  //       return Response;
  //     })
  //     .catch((error) => {
  //       return error;
  //     });
  // }


  //Employees

  async getAllEmployees(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.employees}`, config)
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


  async getEmployeeByID(params) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.employees}/${params}`, config)
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

  async createEmployees(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      axios.post(`${Config.host}${Config.port}${api.employees}`, data, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async updateEmployees(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.patch(`${Config.host}${Config.port}${api.employees}/${data.id}`, data, config).then((Response) => {
        resolve(Response.data)
      })
        .catch(err => {
          reject(err)
        })

    })
  }

  async deleteEmployee(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.delete(`${Config.host}${Config.port}${api.employees}/${data}`, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }



  //Managers

  async getAllManagers(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.managers}`, config)
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


  async getManagerByID(params) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.managers}/${params}`, config)
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

  async createManagers(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      axios.post(`${Config.host}${Config.port}${api.managers}`, data, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async updateManagers(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.patch(`${Config.host}${Config.port}${api.managers}/${data.id}`, data, config).then((Response) => {
        resolve(Response.data)
      })
        .catch(err => {
          reject(err)
        })

    })
  }

  async deleteManager(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.delete(`${Config.host}${Config.port}${api.managers}/${data}`, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }


  //Employee Salary

  async getAllEmpSalary(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.empsalary}`, config)
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


  async getEmpSalaryByID(params) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.empsalary}/${params}`, config)
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

  async getEmpSalaryByEmployee(data) {
    console.log(data);

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params: data
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.empsalarybyemp}`, config)
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


  async createEmpSalary(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      axios.post(`${Config.host}${Config.port}${api.empsalary}`, data, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async updateEmpSalary(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params: data
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.patch(`${Config.host}${Config.port}${api.empsalary}`, data, config).then((Response) => {
        resolve(Response.data)
      })
        .catch(err => {
          reject(err)
        })

    })
  }

  async deleteEmpSalary(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.delete(`${Config.host}${Config.port}${api.empsalary}/${data}`, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

}
export default new Admin();
