import { setLocale } from './i18n'

export default async ({ store, Vue }) => {
    //    await store.dispatch('statistics/fetchStatistics');
    var curlang = ''
    var defaultLangString = ''
    var defaultLang = {}
    var userLang = {}

    await store.dispatch('features/fetchFeatures');
    await store.dispatch("language/fetchActiveLanguages")

    await store.dispatch('settings/fetchSettings')
        .then(settings => {
            console.log("#####################################")
            console.log(settings)
            curlang = settings.filter((setting) => { return setting.key == 'default_language' })[0]
            defaultLang = store.state.language.languages.filter(function (l) { return l.lang == curlang.value })[0]
            console.log("default lang")
            console.log(defaultLang)
            var migrant_tenant = settings.filter((setting) => { return setting.key == 'migrant_tenant' })[0]
            console.log(settings.filter((setting) => { return setting.key == 'translationState' })[0].value)
            var translationState = JSON.parse(settings.filter((setting) => { return setting.key == 'translationState' })[0].value)
            console.log(translationState)
            let translationStateOptions = []
            translationState.forEach(state => {
                console.log(state)
                console.log(defaultLang)
                let label = state.translation.filter((s) => { return s.lang == defaultLang.lang })[0]
                translationStateOptions.push({ "value": state.value, "label": label.state })
            });
            console.log(translationStateOptions)
            Vue.prototype.$translationState = translationState
            Vue.prototype.$translationStateOptions = translationStateOptions
            defaultLangString = defaultLang.name
            Vue.prototype.$defaultLangString = defaultLangString
            Vue.prototype.$defaultLang = defaultLang.lang
            console.log("translationState")

            // somewhere we need to set the userLang reading it dfrom the user preferences and we will override this value
            // TODO: Save this setting in db instead of local storage
            /*
                        if (localStorage.lang === null) {
                            console.log("localstorage undefined")
            
                            localStorage.lang = defaultLang.lang
                        }
                        */
            Vue.prototype.$userLang = localStorage.lang
            Vue.prototype.$migrant_tenant = migrant_tenant.value
            console.log("localstorage lang")
            console.log(localStorage.lang)
            userLang = store.state.language.languages.filter(function (l) { return l.lang == localStorage.lang })[0]
            console.log(userLang)
            setLocale(defaultLang)

        })


}

