export function setCategoryType(state, information_category) {
  for (let i = 0; i < information_category.length; i++) {
    if (information_category[i].translations) {
      for (let j = 0; j < information_category[i].translations.length; j++) {
        information_category[i].translations[j].category = information_category[i].translations[j].informationCategory
        delete information_category[i].translations[j].informationCategory
      }
    }
  }
  state.information_category = information_category
}
