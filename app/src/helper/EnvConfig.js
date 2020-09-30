import fileconfig from '../config/config.json'


export default class EnvConfig {
    constructor() {
        if (process.env.DEV) {
            console.log("we are in DEV environment")
            this.configVals = { apiKey: "aaaa" }

        } else {
            console.log("we are in PROD environment")
            this.configVals = fileconfig
        }
    }

    value (name) {
        console.log("asking config for : " + name)
        return this.configVals[name]
    }

}