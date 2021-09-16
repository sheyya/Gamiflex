// user class functions
// import Axios
import Axios from "axios";

// import config
import Config from "./Config";

const api = {
  signin: "employee/signin",
  count: "employee/count"
};

class Employee {
  api;

  //Users Sign In
  async userSignIn(username, password) {
    var requestData = {
      username: username,
      password: password,
    };
    var userData = {};
    var resp = 600;
    await Axios.post(`${Config.host}${Config.port}${api.signin}`, requestData)
      .then(
        (Response) => {
          resp = Response.status;
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

  // get employee count
  async empCount() {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return Axios.get(`${Config.host}${Config.port}${api.count}`, config)
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
  //     headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` },
  //   };
  //   await Axios.post(
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
}
export default new Employee();
