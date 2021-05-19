import { Converter } from 'showdown'
import { mapGetters, mapActions } from "vuex"
import _ from "lodash"
import referenceExtension from "./markdownExtensions/referenceExtension.js"

export default {
  data() {
    return {
      converter: new Converter({ extensions: [referenceExtension], simpleLineBreaks: true})
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
    async HTMLToMarkdown(html, defaultLang = 'en', userLang = 'en', isAllFetched = false, fakeEntities=false, fakeEntitiesObj) {
      let cleanHTML = this.removeMentionTags(html)
      let md = this.converter.makeMarkdown(cleanHTML)
      md = this.cleanSpaces(md)
      md = await this.markReferences(md, defaultLang, userLang, isAllFetched, fakeEntities, fakeEntitiesObj)
      return md
    },
    markdownToHTML(markdown) {
      let html = this.converter.makeHtml(markdown)
      html = this.cleanSpaces(html)
      return html
    },
    async markReferencesAux(md, lang, fakeEntities=false, fakeEntitiesObj) {
      let result = md
      let entities
      if (!fakeEntities) {
        entities = { // Key is mention-type, value is getter, order is important because of possible title duplicates
          "g": this.glossaryTemp,
          "p": this.processesTemp,
          "i": this.informationTemp,
          "e": this.eventTemp
        }
      } else {
        entities = fakeEntitiesObj
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
            // following regex matches the start of the link markdown, if a reference is inside a link it should not be marked
            // example: [Homepage](https://google.es)
            // matches: [Homepage](
            let linkStartRegExp = /\[[^\]]*\]\(<?$/
            let previousDetectedLink = false
            for (let i = 0; i < splitted.length; i = i + 1) {
              const isTitle = !stringComparator.compare(splitted[i], title)
              if (!previousDetectedLink && isTitle) {
                splitted[i] = prefixTag + "(" + splitted[i] + ")"
              }
              previousDetectedLink = linkStartRegExp.test(splitted[i])
            }
            result = splitted.join("")
            markedTitles.push(title.toLowerCase())
          }
        }
      }
      return result
    },
    async markReferences(md, defaultLang = 'en', userLang = 'en', isAllFetched = false, fakeEntities = false, fakeEntitiesObj) {
      if (isAllFetched) {
        return this.markReferencesAux(md, userLang, fakeEntities, fakeEntitiesObj)
      }
      await Promise.all([
        this.fetchGlossaryTemp({ defaultLang, userLang }),
        this.fetchInformationTemp({ defaultLang, userLang }),
        this.fetchFlowsTemp({ defaultLang, userLang }),
        this.fetchEventTemp({ defaultLang, userLang })
      ])
      return this.markReferencesAux(md, userLang, fakeEntities, fakeEntitiesObj)
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