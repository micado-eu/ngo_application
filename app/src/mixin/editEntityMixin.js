export default {
    data () {
        return {
            activeLanguage: this.$i18n.locale,
            langTab: this.$defaultLangString,

        }
    },
    computed: {
        languages () {
            return this.$store.state.language.languages;
        },
    },
    methods: {
        filterTranslationModel (currentLang) {
            return function (element) {
                return element.lang == currentLang;
            }
        }
    }
};
