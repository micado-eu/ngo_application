import { Converter } from 'showdown'
import { mapGetters, mapActions } from "vuex"

export default {
    data() {
        return {
            converter: new Converter()
        }
    },
    methods: {
        ...mapActions("glossary", ["fetchGlossary"]),
        HTMLToMarkdown(html) {
            return this.converter.makeMarkdown(html)
        },
        markdownToHTML(markdown) {
            return this.converter.makeHtml(markdown)
        },
        async markGlossaryReferences(html, lang) {
            return this.fetchGlossary().then(() => {
                let glossaryTermsByLang = []
                for (let glossaryElement of this.glossary) {
                    if (glossaryElement.translations) {
                        glossaryTermsByLang.push(glossaryElement.translations.filter(t => t.lang === lang)[0])
                    }
                }
                let result = html
                for (const glossaryTerm of glossaryTermsByLang) {
                    if (glossaryTerm.title) {
                        // Look for the term's titles that are not already marked
                        let regexp = new RegExp(`(?<!<span data-mention-id="\d+" class="mention">)${glossaryTerm.title}`, "gi")
                        let match
                        let initialText = result
                        let offset = 0
                        while ((match = regexp.exec(result)) !== null) {
                            const index = match.index + offset
                            const lastIndex = regexp.lastIndex + offset
                            // Add the tag to the text
                            const prefixTag = `<span data-mention-id="${glossaryTerm.id}" class="mention">`
                            const suffixTag = "</span>"
                            offset = offset + prefixTag.length + suffixTag.length
                            const first = initialText.substring(0, index)
                            const middle = initialText.substring(index, lastIndex)
                            const last = initialText.substring(lastIndex)
                            initialText = first + prefixTag + middle + suffixTag + last
                        }
                        result = initialText
                    }
                }
                return result
            })
        }
    },
    computed: {
        ...mapGetters("glossary", ["glossary"])
    }
}