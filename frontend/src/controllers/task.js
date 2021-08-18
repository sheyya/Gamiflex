// user class functions
// import axios
import axios from "axios";

// import config
import Config from "./Config";

const api = {
  tasks: "tasks/tsk",
  taskTypes: "tasks/tsktype",
  taskbyemp: "tasks/tskbyemp"
};

class Task {
  api;

  //Tasks

  async getAllTasks(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.tasks}`, config)
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


  async getTaskByID(params) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.tasks}/${params}`, config)
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

  async getTaskByEmployee(data) {
    console.log(data);

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params: data
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.taskbyemp}`, config)
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

  async createTasks(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      axios.post(`${Config.host}${Config.port}${api.tasks}`, data, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async updateTasks(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.patch(`${Config.host}${Config.port}${api.tasks}/${data.id}`, data, config).then((Response) => {
        resolve(Response.data)
      })
        .catch(err => {
          reject(err)
        })

    })
  }

  async deleteTask(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.delete(`${Config.host}${Config.port}${api.tasks}/${data}`, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }



  //TaskTypes

  async getAllTaskTypes(params = {}) {

    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` },
      params
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.taskTypes}`, config)
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


  async getTaskTypeByID(params) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      return axios.get(`${Config.host}${Config.port}${api.taskTypes}/${params}`, config)
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

  async createTaskTypes(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    return new Promise((resolve, reject) => {
      axios.post(`${Config.host}${Config.port}${api.taskTypes}`, data, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async updateTaskTypes(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.patch(`${Config.host}${Config.port}${api.taskTypes}/${data.id}`, data, config).then((Response) => {
        resolve(Response.data)
      })
        .catch(err => {
          reject(err)
        })

    })
  }

  async deleteTaskType(data) {
    const config = {
      headers: { Authorization: `${localStorage.getItem('usertoken')}` }
    };
    console.log(data.id);

    return new Promise((resolve, reject) => {
      axios.delete(`${Config.host}${Config.port}${api.taskTypes}/${data}`, config)
        .then((Response) => {
          resolve(Response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

}
export default new Task();
