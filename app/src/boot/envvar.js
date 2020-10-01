import axios from 'axios'

// This boot retrieve the apiKey from the URL so that is not taken by the development data but by the dynamically generated in the container

export default async ({ Vue }) => {

    const resp = await axios.get('/statics/config.json');
    console.log(resp)
    Vue.prototype.$envconfig = resp.data
}