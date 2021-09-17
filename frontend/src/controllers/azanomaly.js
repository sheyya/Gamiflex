// user class functions
// import axios
import axios from "axios";

// import config
import Config from "./Config";

const api = {
    azanom: "azanomaly/getchangepoints",
};

class AzAnomaly {
    api;

    //AzAnomalys

    async getAnomaly(data) {

        const config = {
            headers: { Authorization: `${localStorage.getItem('usertoken')}` },
        };
        return new Promise((resolve, reject) => {
            return axios.post(`${Config.host}${Config.port}${api.azanom}`, data, config)
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
export default new AzAnomaly();
