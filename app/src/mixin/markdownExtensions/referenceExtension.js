/**
 * See https://github.com/showdownjs/showdown/wiki/Extensions for reference
 */
export default function referenceExtension() {
  let ext = {
    type: 'lang',
    /**
     * example of regex: @[glossary,56](reference)
     * marks the word "reference" like
     * <span data-mention-id="56" mention-type="glossary" class="mention">reference</span>
     * First capture group: entity type i.e. glossary, event, etc
     * Second capture group: entity id
     * Third capture group: reference title
     */
    regex: /@\[(.+),(\d+)\]\((.+)\)/g,
    replace: function (match, entityType, entityId, referenceText) {
      return `<span data-mention-id="${entityId}" mention-type="${entityType}" class="mention">${referenceText}</span>`
    }
  }
  return [ext]
}
