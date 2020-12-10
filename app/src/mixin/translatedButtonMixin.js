import TranslateStateButton from '../components/shared/translatestatebutton/TranslateStateButton'

export default {
    components: {
        TranslateStateButton
    },
    methods: {
        changeTranslationState (element, state) {
            console.log(element)
            element.translations.forEach(el => {
                el.translationState = state
            })
            console.log(element)
        }
    }
}
