import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `http://rasa.micado.it:5005`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }/*,

        transformResponse: [function (data) {
          // Do whatever you want to transform the data
          console.log("in transformresponse");
          console.log(data);
          return data;
        }],*/
    })
}
