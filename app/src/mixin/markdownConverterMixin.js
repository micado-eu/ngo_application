import { Converter } from 'showdown'
import { mapGetters, mapActions } from "vuex"
import _ from "lodash"
import referenceExtension from "./markdownExtensions/referenceExtension.js"

export default {
  data() {
    return {
      converter: new Converter({ extensions: [referenceExtension], simpleLineBreaks: true })
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
    moveSpaces(html) {
      // Check https://github.com/micado-eu/MICADO/issues/119 for more information about issues related to spaces in bold or italic tags
      // Move spaces inside and next to italics and bold tags in markdown to the exterior
      let splitted = html.split(/(<strong><em>.*?<\/em><\/strong>)/g)
      let boldItalicFixed = this.moveSpacesAux(splitted, "<strong><em>", "</em></strong>")
      splitted = boldItalicFixed.split(/(<em>.*?<\/em>)/g)
      let italicFixed = this.moveSpacesAux(splitted, "<em>", "</em>")
      splitted = italicFixed.split(/(<strong>.*?<\/strong>)/g)
      let boldFixed = this.moveSpacesAux(splitted, "<strong>", "</strong>")
      return boldFixed
    },
    moveSpacesAux(splitted, openTag, closeTag) {
      const openTagLength = openTag.length
      const closeTagLength = closeTag.length
      for (let i = 0; i < splitted.length; i++) {
        if (splitted[i].startsWith(openTag)) {
          // First character inside tags
          let j = openTagLength
          let spaceCounter = 0
          // Count spaces at the beginning of the bold/italic
          while (splitted[i].charAt(j) === ' ') {
            spaceCounter++
            j++
          }
          if (spaceCounter > 0) {
            splitted[i] = splitted[i].substr(0, openTagLength) + splitted[i].substr(j)
            splitted.splice(i, 0, " ".repeat(spaceCounter > 0))
            i++ // Move to new position
          }
          spaceCounter = 0
          // Find ending of tag
          j = splitted[i].indexOf(closeTag)
          // Backtrack to find trailing spaces
          while (splitted[i].charAt(j - 1) === ' ') {
            spaceCounter++
            j--
          }
          if (spaceCounter > 0) {
            splitted[i] = splitted[i].substr(0, j) + splitted[i].substr(splitted[i].indexOf(closeTag))
            splitted.splice(i + 1, 0, " ".repeat(spaceCounter > 0))
            i++ // Next position will be the spaces, which we can skip
          }
        }
      }
      return splitted.join("")
    },
    removeMentionTags(md) {
      return md.replace(/<span data-mention-id="\d+" mention-type="\w+" class="mention">/g, "").replace(/<\/span>/g, "")
    },
    removeReferencesFromExternalLinks(md) {
      // clears references in both the [] and () of a link
      let clearRegex1 = /(\[[^(]*)@\[.*?,\d+\]\((.*?)\)(.*?\]\(<.*)@\[.*?,\d+\]\((.*?)\)(.*>\))/g
      let result = md
      let splitted = md.split(clearRegex1)
      while (splitted.length > 1) {
        result = splitted.join("")
        splitted = result.split(clearRegex1)
      }
      // clears references in []
      let clearRegex2 = /(\[[^(]*)@\[.*?,\d+\]\((.*?)\)(.*?\]\(<.*>\))/g
      splitted = result.split(clearRegex2)
      while (splitted.length > 1) {
        result = splitted.join("")
        splitted = result.split(clearRegex2)
      }
      // clears references in ()
      let clearRegex3 = /(\[[^(]*\]\(<.*)@\[.*?,\d+\]\((.*?)\)(.*>\))/g
      splitted = result.split(clearRegex3)
      while (splitted.length > 1) {
        result = splitted.join("")
        splitted = result.split(clearRegex3)
      }
      return result
    },
    async HTMLToMarkdown(html, defaultLang = 'en', userLang = 'en', isAllFetched = false, fakeEntities = false, fakeEntitiesObj) {
      let cleanHTML = this.removeMentionTags(html)
      cleanHTML = this.moveSpaces(cleanHTML)
      let md = this.converter.makeMarkdown(cleanHTML)
      md = this.cleanSpaces(md)
      md = await this.markReferences(md, defaultLang, userLang, isAllFetched, fakeEntities, fakeEntitiesObj)
      return md
    },
    markdownToHTML(markdown) {
      let html = this.converter.makeHtml(markdown)
      html = this.cleanSpaces(html)
      html = this.moveSpaces(html)
      return html
    },
    async markReferencesAux(md, lang, fakeEntities = false, fakeEntitiesObj) {
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
      // Regexes used for checking if we are inside a reference later
      const fullCheckRegex = /@\[([^,]+),(\d+)\][\(（]([^\)）]+)[\)）]/gi
      const partialCheckRegex = /@\[([^,]+),(\d+)\][\(（]/gi
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
              const isTitle = !stringComparator.compare(splitted[i], title)
              if (isTitle) {
                if (i > 0) {
                  // Check that we are not inside a reference already
                  const partialCheck = partialCheckRegex.test(splitted[i - 1])
                  const fullCheck = fullCheckRegex.test(splitted[i - 1])
                  if (!partialCheck || fullCheck) {
                    splitted[i] = prefixTag + "(" + splitted[i] + ")"
                  }
                } else {
                  splitted[i] = prefixTag + "(" + splitted[i] + ")"
                }
              }
            }
            result = splitted.join("")
            markedTitles.push(title.toLowerCase())
          }
        }
      }
      result = this.removeReferencesFromExternalLinks(result)
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