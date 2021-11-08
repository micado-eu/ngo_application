export function setGlossary(state, glossary) {
  state.glossary = glossary
}

export function setGlossaryProd(state, glossary) {
  state.glossaryProd = glossary.filter(t => t.translated)
}

export function setGlossaryTemp(state, glossary) {
  state.glossaryTemp = glossary.filter(t => !t.translated)
}