//import fileconfig from '../statics/config.json'
import axios from 'axios'
/*
let fileconfig = null
const sendGetRequest = async () => {
    try {
        const resp = await axios.get('/statics/config.json');
        console.log(resp.data);
        fileconfig = resp.data
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

sendGetRequest();
*/
//EnvConfigOption = (e) => void


export default class EnvConfig {
    constructor(configuration) {
        this.configVals = null

        //    configuration(this)
        /*
        return (async () => {
            if (process.env.PROD) {
                console.log("we are in DEV environment")
                this.configVals = { apiKey: "eyJ4NXQiOiJaalJtWVRNd05USmpPV1U1TW1Jek1qZ3pOREkzWTJJeU1tSXlZMkV6TWpkaFpqVmlNamMwWmc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImFwcGxpY2F0aW9uIjp7Im93bmVyIjoiYWRtaW4iLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6IkRlZmF1bHRBcHBsaWNhdGlvbiIsImlkIjoxLCJ1dWlkIjoiYWMwYWQxNmQtMWRiNy00NzhiLWFhNjAtZjE3YjIwM2JhMWRiIn0sInRpZXJJbmZvIjp7IlNpbHZlciI6eyJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOm51bGx9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJiYWNrZW5kIiwiY29udGV4dCI6IlwvYmFja2VuZFwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJTaWx2ZXIifV0sImlhdCI6MTYwMTI3NDc4NiwianRpIjoiODMwNmI2MTAtZDNiZi00MTU1LTk1ZTgtNGFlMDc1NWZhZmE1In0=.OrP14B2bqfsLKjrtCAjfqkuUXLpQCd8qooU3suDOEPsCGW1k4H7OPBFB2gTzkubbhBD6XaS164qSuNlMxzE7nyfse0vglJJBLPszVTo4v0swx7dI2Eu3eoK9_AnQca_VELdMJOSlLda-xIKQR20cFNfc6U3qm5En_m6t63OA9MXUDk2--kmApyHdJI56KVZh-vEmFkE7ms2chYUJuYvWlaxeAF8YDjyHMZbt-FtrDu8CueMrMFPL3ENvXQMMrSVt8cX6PMfOl2S0HSmsNs-mMlUGar4K4vZCgtWkVFkfl5vQsaHP0wuFQEUx4Us0NeHbFrSj2X2ERUbcUQ6vNWpc6g==" }

            } else {
                console.log("we are in PROD environment")
                const userPermissions = await this.getFile()
                console.log(userPermissions)
                const resp = await axios.get('/statics/config.json');
                console.log(resp.data);
                this.configVals = resp.data
                /*
                const sendGetRequest = async () => {
                    try {
                        const resp = await axios.get('/statics/config.json');
                        console.log(resp.data);
                        this.configVals = resp.data
                    } catch (err) {
                        // Handle Error Here
                        console.error(err);
                    }
                };
    
                sendGetRequest();
                
                Promise.all(axios.get('/statics/config.json'))
                    .then((resp) => {
                        console.log("recuperato il file")
                        console.log(resp.data);
                        this.configVals = resp.data
                    })
    

            }
        })();
        */
    }

    static async Initialize () {
        // fetch the external data here (this is just a demonstration, could be any async op)
        const resp = await axios.get('/statics/config.json');
        console.log(resp.data);
        // now set the data on the class instance
        return (h) => {
            h.configVals = resp.data
        }
    }
    getFile = async () => {
        try {
            let res = await axios.get('/statics/config.json');
            this.configVals = res.data
            return res
            //            return data;
        } catch (err) {
            console.log(err.message);
        }
    }

    value (name) {
        console.log("asking config for : " + name)
        if (name in this.configVals) {
            console.log("we have this")
            console.log(this.configVals)
            return this.configVals[name]
        }
        return undefined
    }

}