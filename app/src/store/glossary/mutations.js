export function setGlossary(state, glossary) {
  for (let i = 0; i < glossary.length; i++) {
    if (glossary[i].translations) {
      for (let j = 0; j < glossary[i].translations.length; j++) {
        if (glossary[i].translations[j].description) {
          glossary[i].translations[j].description = JSON.parse(glossary[i].translations[j].description)
        }
      }
    }
  }
  state.glossary = glossary
}