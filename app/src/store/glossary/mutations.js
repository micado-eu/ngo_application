export function setGlossary(state, glossary) {
  for (let i = 0; i < glossary.length; i++) {
    for (let j = 0; j < glossary[i].translations.length; j++) {
      glossary[i].translations[j].description = JSON.parse(glossary[i].translations[j].description)
    }
  }
  state.glossary = glossary
}