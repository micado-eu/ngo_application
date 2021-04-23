import { Converter } from 'showdown'
import { mapGetters, mapActions } from "vuex"
import _ from "lodash"
import referenceExtension from "./markdownExtensions/referenceExtension.js"

export default {
  data() {
    return {
      converter: new Converter({ extensions: [referenceExtension] })
    }
  },
  methods: {
    ...mapActions("glossary", ["fetchGlossaryTemp"]),
    ...mapActions('information', ['fetchInformationTemp']),
    ...mapActions('flows', ['fetchFlowsTemp']),
    ...mapActions('event', ['fetchEventTemp']),
    cleanSpaces(text) {
      // At the moment of writing there is this issue with the Showdown converter: https://github.com/showdownjs/showdown/issues/669
      // Having &nbsp; instead of spaces breaks tooltips overflow wrap, so we substitute them here
      return text.replace(/&nbsp;/g, " ")
    },
    removeMentionTags(md) {
      return md.replace(/<span data-mention-id="\d+" mention-type="\w+" class="mention">/g, "").replace(/<\/span>/g, "")
    },
    async HTMLToMarkdown(html, defaultLang = 'en', userLang = 'en', isAllFetched = false) {
      let md = this.converter.makeMarkdown(html)
      md = this.cleanSpaces(md)
      md = this.removeMentionTags(md)
      md = await this.markReferences(md, defaultLang, userLang, isAllFetched)
      return md
    },
    markdownToHTML(markdown) {
      let html = this.converter.makeHtml(markdown)
      html = this.cleanSpaces(html)
      return html
    },
    async markReferencesAux(md, lang) {
      let result = md
      let entities = { // Key is mention-type, value is getter, order is important because of possible title duplicates
        "g": this.glossaryTemp,
        "p": this.processesTemp,
        "i": this.informationTemp,
        "e": this.eventTemp
      }
      let markedTitles = [] // Avoids marking twice if an element has already been marked with the same title from another entity
      const stringComparator = new Intl.Collator(lang, { sensitivity: 'accent' })
      for (const [key, value] of Object.entries(entities)) {
        // Remove elements with repeated titles from previous entities (ignoring case)
        const filteredTerms = value.filter((elem) => {
          for (const marked of markedTitles) {
            if (!stringComparator.compare(marked, this.elemTitle(elem))) {
              return false
            }
          }
          return true
        })
        // Iterate through all the values given by getter for all entities
        for (const term of filteredTerms) {
          let title = this.elemTitle(term)
          if (title.length > 0) {
            // Look for the term's titles that are not already marked
            const escapedTitle = _.escapeRegExp(title)
            let regexp = new RegExp(`(${escapedTitle})`, "gi")
            let splitted = result.split(regexp)
            // Add the tag to the text
            const prefixTag = `@[${key},${term.id}]`
            for (let i = 0; i < splitted.length; i = i + 1) {
              if (!stringComparator.compare(splitted[i], title)) {
                splitted[i] = prefixTag + "(" + splitted[i] + ")"
              }
            }
            result = splitted.join("")
            markedTitles.push(title.toLowerCase())
          }
        }
      }
      return result
    },
    async markReferences(md, defaultLang = 'en', userLang = 'en', isAllFetched = false) {
      if (isAllFetched) {
        return this.markReferencesAux(md, userLang)
      }
      await Promise.all([
        this.fetchGlossaryTemp({ defaultLang, userLang }),
        this.fetchInformationTemp({ defaultLang, userLang }),
        this.fetchFlowsTemp({ defaultLang, userLang }),
        this.fetchEventTemp({ defaultLang, userLang })
      ])
      return this.markReferencesAux(md, userLang)
    },
    elemTitle(term) {
      if (term.process) {
        return term.process
      }
      else {
        return term.title
      }
    }
  },
  computed: {
    ...mapGetters("glossary", ["glossaryTemp"]),
    ...mapGetters('information', ['informationTemp']),
    ...mapGetters('flows', ['processesTemp']),
    ...mapGetters('event', ['eventTemp'])
  }
}