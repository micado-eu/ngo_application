import axios from 'axios'
import fileconfig from '../statics/config.json'


// This boot retrieve the apiKey from the URL so that is not taken by the development data but by the dynamically generated in the container

export default async ({ Vue }) => {
    if (process.env.PROD) {
        console.log("we are in PROD environment")

        const resp = await axios.get('/statics/config.json');
        console.log(resp)
        Vue.prototype.$envconfig = resp.data
    } else {
        console.log("we are in DEV environment")
        console.log(fileconfig)

        Vue.prototype.$envconfig = fileconfig

    }
}