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
    async markGlossaryReferencesAux(html, lang) {
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
          let regexp = new RegExp(`(${glossaryTerm.title})`, "gi")
          let splitted = result.split(regexp)
          // Add the tag to the text
          const prefixTag = `<span data-mention-id="${glossaryTerm.id}" class="mention">`
          const suffixTag = "</span>"
          for (let i = 0; i < splitted.length; i = i + 1) {
            if (splitted[i].length === glossaryTerm.title.length) {
              splitted[i] = prefixTag + splitted[i] + suffixTag
            }
          }
          result = splitted.join("")
        }
      }
      return result
    },
    async markGlossaryReferences(html, lang, isGlossaryFetched = false) {
      if (isGlossaryFetched) {
        return this.markGlossaryReferencesAux(html, lang)
      }
      await this.fetchGlossary()
      return this.markGlossaryReferencesAux(html, lang)
    }
  },
  computed: {
    ...mapGetters("glossary", ["glossary"])
  }
}