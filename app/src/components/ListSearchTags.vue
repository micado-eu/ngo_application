<template>
  <div>
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{$t(title)}}</div>
    <span v-if="loading">Loading...</span>
    <div
      class="row"
      v-if=!loading
    >
      <div class="col q-ml-md filter-list">
        <q-list
          bordered
          v-if="categories_enabled || topics_enabled || user_types_enabled"
        >
          <q-item style="max-width: 100%">
            <q-item-section>
              <a
                href="javascript:void(0)"
                @click="clearFilters()"
                class="clear_all"
              >
                {{$t("filters.clear_all")}}
              </a>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="topics_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="filter-title">
                  {{$t("filters.topics_title")}}
                </q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="topic in filterTopics"
              :key="topic.id"
            >
              <q-checkbox
                color="accent"
                v-model="selectedTopics"
                :val="topic.id"
                class="filter-text"
                :label="topic.topic"
                @input="filterByTopics()"
              />
              <span class="q-mt-sm">
                {{topic.translations.filter(t => t.lang ===  lang)[0].topic}}
              </span>
              <q-img
                :src="topic.icon"
                spinner-color="white"
                id="image"
                :alt="topic.topic"
                class="q-ml-sm filter-icon"
                :img-style="{'max-width': '24px', 'max-height': '24px'}"
              />
            </q-item>
            <q-item v-if="!isMaxShowMoreTopics">
              <a
                href="javascript:void(0)"
                class="show_more"
                @click="showMoreTopics()"
              >
                {{$t("filters.show_more")}}
              </a>
            </q-item>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="categories_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="filter-title">
                  {{$t("filters.category_title")}}
                </q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="category in filterCategories"
              :key="category.id"
            >
              <q-radio
                color="accent"
                v-model="selectedCategory"
                :val="category"
                :label="category.category"
                @input="filterByCategory()"
                class="filter-text"
              />
            </q-item>
            <q-item v-if="!isMaxShowMoreCategories">
              <a
                href="javascript:void(0)"
                class="show_more"
                @click="showMoreCategories()"
              >
                {{$t("filters.show_more")}}
              </a>
            </q-item>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="user_types_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="filter-title">
                  {{$t("filters.user_types_title")}}
                </q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="userType in filterUserTypes"
              :key="userType.id"
            >
              <q-checkbox
                color="accent"
                v-model="selectedUserTypes"
                :val="userType.id"
                class="filter-text"
                :label="userType.user_type"
                @input="filterByUserTypes()"
              />
              <span class="q-mt-sm">
                {{userType.translations.filter(t => t.lang ===  lang)[0].userType}}
              </span>
              <q-img
                :src="userType.icon"
                spinner-color="white"
                id="image"
                :alt="userType.user_type"
                class="q-ml-sm filter-icon"
                :img-style="{'max-width': '24px', 'max-height': '24px'}"
              />
            </q-item>
            <q-item v-if="!isMaxShowMoreUserTypes">
              <a
                href="javascript:void(0)"
                class="show_more"
                @click="showMoreUserTypes()"
              >
                {{$t("filters.show_more")}}
              </a>
            </q-item>
          </q-expansion-item>
        </q-list>
      </div>
      <div class="q-mx-sm col-10">
        <div class="q-mr-md row">
          <q-input
            color="accent"
            v-model="search"
            debounce="500"
            filled
            outlined
            :label='$t("input_labels.search")'
            class="search-bar col"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- <q-btn
            no-caps
            :label='$t("button.categories")'
            class="cat-btn q-ml-md"
            :to="categories_url"
            v-if="categories_enabled"
          /> -->
          <q-btn
            no-caps
            :label='$t(add_label)'
            class="add-btn q-ml-md q-my-lg margin-right-btn"
            data-cy="add_element"
            :to="new_url"
          />
        </div>
        <div class="flex">
          <!-- column title -->
          <span style="flex: 11.45"></span>
          <span style="flex: 4">
            {{$t("lists.published")}}
          </span>
        </div>
        <div class="row q-mb-sm">
          <q-separator style="max-width: 91.7%; background-color: black" />
        </div>
        <div class="row">
          <q-list
            class="col-11 element-list"
            separator
          >
            <!-- items -->
            <q-item
              v-for="item in filteredElements"
              :key="item.id"
              :id="item.id"
              clickable
              @mouseover="hovered = item.id"
              @mouseleave="hovered = -1"
            >
              <q-item-section class="title_section q-mt-md">
                <q-item-label class="title-label">
                  {{ item.title }}
                </q-item-label>
                <div
                  class="q-my-sm"
                  style="display: inline"
                >
                  <span
                    class="q-mr-md tags_text"
                    v-if="topics_enabled && item.topics.length > 0"
                  >
                    {{$t("lists.topics")}}:
                    <q-img
                      v-for="(topic, index) in item.topics"
                      :key="topic.id"
                      :src="topic.icon"
                      spinner-color="white"
                      id="image"
                      :alt="topic.topic"
                      :img-style="{'max-width': '24px', 'max-height': '24px'}"
                      :class="index !== (item.topics.length - 1) ? 'filter-icon q-mr-xs' : 'filter-icon'"
                    />
                  </span>
                  <span
                    class="q-mr-md tags_text"
                    v-if="categories_enabled"
                  >
                    {{$t("lists.category")}}: {{item.category.category}}
                  </span>
                  <span
                    v-if="user_types_enabled && item.userTypes.length > 0"
                    class="tags_text"
                  >
                    {{$t("lists.user_types")}}:
                    <q-img
                      v-for="(userType, index) in item.userTypes"
                      :key="userType.id"
                      :src="userType.icon"
                      spinner-color="white"
                      id="image"
                      :alt="userType.topic"
                      :img-style="{'max-width': '24px', 'max-height': '24px'}"
                      :class="index !== (item.userTypes.length - 1) ? 'filter-icon q-mr-xs' : 'filter-icon'"
                    />
                  </span>
                </div>
                <glossary-editor-viewer
                  class="viewer"
                  :content="item.description"
                  v-if="!loading"
                  glossary_fetched
                  :lang="lang"
                  readMore
                  @readMorePressed=toggleDate(item.id)
                  @readLessPressed=toggleDate(item.id)
                >
                  <template v-slot:append>
                    <span
                      class="date-text q-mt-sm"
                      v-if="is_event && showDates[item.id]"
                    >
                      {{$t("lists.start_date")}}: {{item.startDate}}
                    </span>
                    <br/>
                    <span
                      class="date-text q-mb-sm"
                      v-if="is_event && showDates[item.id]"
                    >
                      {{$t("lists.end_date")}}: {{item.endDate}}
                    </span>
                  </template>
                </glossary-editor-viewer>
              </q-item-section>
              <q-item-section
                side
                class="q-mt-md"
              >
                <q-toggle
                  v-model="item.published"
                  @input="updatePublished($event, item.id)"
                  color="green"
                />
              </q-item-section>
              <q-item-section
                side
                :style="{ visibility: hovered === item.id ? 'visible' : 'hidden' }"
                class="icon_btn_section"
              >
                <q-btn
                  round
                  class="item-btn"
                  icon="img:statics/icons/Icon - edit - orange (600x600).png"
                  :to="edit_url_fn(item.id)"
                  :data-cy="'edit_button' + item.id"
                />
                <!-- <br>
                <q-btn
                  round
                  class="item-btn"
                  icon="img:statics/icons/Icon - Delete - magenta (600x600).png"
                  @click="delete_fn(item)"
                  :data-cy="'delete_button' + item.id"
                /> -->
              </q-item-section>
            </q-item>
          </q-list>
          <div
            class="q-ml-sm q-mt-md col"
            v-if="alphabetical_sorting"
          >
            <span
              v-for="(letter, index) in alphabet"
              :key="letter"
              class="row alphabet"
              @click="scrollIntoElement(index)"
            >
              {{letter}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Fuse from 'fuse.js'
import GlossaryEditorViewer from './GlossaryEditorViewer'

export default {
  name: 'ListSearchTags',
  props: {
    elements: {
      type: Array,
      default() {
        return []
      }
    },
    new_url: {
      type: String,
      default: '/'
    },
    edit_url_fn: {
      type: Function,
      default() {
        return () => '/'
      }
    },
    delete_fn: {
      type: Function,
      default() {
        return () => ''
      }
    },
    publish_fn: {
      type: Function,
      default() {
        return () => ''
      }
    },
    title: {
      type: String,
      default: ''
    },
    icon_name: {
      type: String,
      default: ''
    },
    add_label: {
      type: String,
      default: 'Add'
    },
    categories_enabled: {
      type: Boolean,
      default: false
    },
    categories_url: {
      type: String,
      default: '/'
    },
    alphabetical_sorting: {
      type: Boolean,
      default: false
    },
    topics_enabled: {
      type: Boolean,
      default: false
    },
    user_types_enabled: {
      type: Boolean,
      default: false
    },
    is_event: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovered: -1,
      // display only elements in the language selected
      translatedElements: [],
      filteredElementsBySearch: [],
      filteredElementsByCategory: [],
      filteredElementsByTopics: [],
      filteredElementsByUserTypes: [],
      searchText: '',
      topics: [],
      userTypes: [],
      translatedCategories: [],
      selectedCategory: undefined,
      selectedTopics: [],
      selectedUserTypes: [],
      lang: '',
      alphabet: [],
      alphabetIds: [],
      lastIndexCategories: 3,
      lastIndexTopics: 3,
      lastIndexUserTypes: 3,
      loading: true,
      showDates: []
    }
  },
  components: {
    'glossary-editor-viewer': GlossaryEditorViewer
  },
  methods: {
    ...mapActions('glossary', ['fetchGlossary']),
    updatePublished(value, id) {
      this.publish_fn(value, id)
    },
    addOrRemoveSelectedCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = undefined
      } else {
        this.selectedCategory = category
      }
      this.filterByCategory()
    },
    filterByCategory() {
      if (this.selectedCategory) {
        this.filteredElementsByCategory = this.translatedElements.filter((e) => {
          if (e.category !== this.selectedCategory) {
            return false
          }
          return true
        })
      } else {
        this.filteredElementsByCategory = this.translatedElements
      }
    },
    filterByTopics() {
      if (this.selectedTopics.length > 0) {
        this.filteredElementsByTopics = []
        for (const e of this.translatedElements) {
          const matchedTopics = []
          for (const topic of this.selectedTopics) {
            if (e.topics) {
              for (const elemTopic of e.topics) {
                if (elemTopic.id === topic) {
                  // This check avoids duplicate matches
                  if (matchedTopics.indexOf(topic) == -1) {
                    matchedTopics.push(topic)
                  }
                }
              }
            }
          }
          if (matchedTopics.length == this.selectedTopics.length) {
            this.filteredElementsByTopics.push(e)
          }
        }
      } else {
        this.filteredElementsByTopics = this.translatedElements
      }
    },
    filterByUserTypes() {
      if (this.selectedUserTypes.length > 0) {
        this.filteredElementsByUserTypes = []
        for (const e of this.translatedElements) {
          const matchedUserTypes = []
          for (const userType of this.selectedUserTypes) {
            if (e.userTypes) {
              for (const elemUserType of e.userTypes) {
                if (elemUserType.id === userType) {
                  // This check avoids duplicate matches
                  if (matchedUserTypes.indexOf(userType) == -1) {
                    matchedUserTypes.push(userType)
                  }
                }
              }
            }
          }
          if (matchedUserTypes.length == this.selectedUserTypes.length) {
            this.filteredElementsByUserTypes.push(e)
          }
        }
      } else {
        this.filteredElementsByUserTypes = this.translatedElements
      }
    },
    compare(a, b) {
      return a.title.localeCompare(b.title, this.$userLang, { sensitivity: 'base' })
    },
    compareTranslationDates(a, b) {
      return new Date(b.translationDate) - new Date(a.translationDate)
    },
    scrollIntoElement(index) {
      document.getElementById(this.alphabetIds[index]).scrollIntoView()
    },
    clearFilters() {
      this.selectedCategory = undefined
      this.filteredElementsByCategory = this.translatedElements
      this.filteredElementsByTopics = this.translatedElements
      this.filteredElementsByUserTypes = this.translatedElements
      this.selectedTopics = []
      this.selectedUserTypes = []
    },
    showMoreCategories() {
      this.lastIndexCategories += 3
    },
    showMoreTopics() {
      this.lastIndexTopics += 3
    },
    showMoreUserTypes() {
      this.lastIndexUserTypes += 3
    },
    toggleDate(id) {
      this.showDates[id] = !this.showDates[id]
    },
    initializeList() {
      this.translatedElements = this.elements.map((e) => {
        let translation
        if (e.translations) {
          const idx = e.translations.findIndex((t) => t.lang === this.lang)
          if (idx !== -1) {
            translation = { ...e.translations[idx] }
            translation.id = e.id // In case of errors we still have the id
            if (this.categories_enabled) {
              const idxCat = e.category.translations.findIndex((t) => t.lang === this.lang)
              translation.category = e.category.translations[idxCat]
              if (this.translatedCategories.indexOf(translation.category) == -1) {
                this.translatedCategories.push(translation.category)
              }
            }
            if (this.topics_enabled) {
              translation.topics = e.topics.map(
                (topicRel) => {
                  const finalTopic = this.topic.filter((topic) => topicRel.idTopic === topic.id)[0]
                  if (this.topics.indexOf(finalTopic) === -1) {
                    this.topics.push(finalTopic)
                  }
                  return finalTopic
                }
              )
            }
            if (this.user_types_enabled) {
              translation.userTypes = e.userTypes.map(
                (userTypeRel) => {
                  const finalUserTypes = this.user.filter(
                    (userType) => userTypeRel.idUserTypes === userType.id
                  )[0]
                  if (this.userTypes.indexOf(finalUserTypes) === -1) {
                    this.userTypes.push(finalUserTypes)
                  }
                  return finalUserTypes
                }
              )
            }
            if (this.is_event) {
              const startDate = new Date(e.startDate)
              translation.startDate = `${startDate.getUTCFullYear()}-` +
                `${startDate.getUTCMonth() + 1}-` +
                `${startDate.getUTCDate()} ` +
                `${startDate.getUTCHours().toLocaleString(undefined, { minimumIntegerDigits: 2 })}:` +
                `${startDate.getUTCMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
              const finishDate = new Date(e.endDate)
              translation.endDate = `${finishDate.getUTCFullYear()}-` +
                `${finishDate.getUTCMonth() + 1}-` +
                `${finishDate.getUTCDate()} ` +
                `${finishDate.getUTCHours().toLocaleString(undefined, { minimumIntegerDigits: 2 })}:` +
                `${finishDate.getUTCMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
            }
            translation.published = e.published
            this.showDates[e.id] = false
            return translation
          } else return undefined
        }
      })
      this.translatedElements = this.translatedElements.filter((e) => e !== undefined)
      if (this.alphabetical_sorting) {
        this.translatedElements.sort(this.compare)
        for (const elem of this.translatedElements) {
          const firstChar = elem.title.charAt(0).toUpperCase()
          if (!this.alphabet.includes(firstChar)) {
            this.alphabet.push(firstChar)
            this.alphabetIds.push(elem.id)
          }
        }
      } else {
        this.translatedElements.sort(this.compareTranslationDates)
      }
      this.filteredElementsBySearch = this.translatedElements
      this.filteredElementsByCategory = this.translatedElements
      this.filteredElementsByTopics = this.translatedElements
      this.filteredElementsByUserTypes = this.translatedElements
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('topic', ['topic']),
    ...mapGetters('user_type', ['user']),
    search: {
      get() {
        return this.searchText
      },
      set(newSearch) {
        if (newSearch) {
          const fuse = new Fuse(this.translatedElements, {
            keys: ['title']
          })
          this.filteredElementsBySearch = fuse
            .search(newSearch)
            .map((i) => i.item)
          this.searchText = newSearch
        } else {
          this.filteredElementsBySearch = this.translatedElements
          this.searchText = ''
        }
      }
    },
    filteredElements() {
      const { filteredElementsByCategory } = this
      const { filteredElementsByTopics } = this
      const { filteredElementsByUserTypes } = this
      return this.filteredElementsBySearch.filter(
        (n) => filteredElementsByCategory.indexOf(n) !== -1
          && filteredElementsByTopics.indexOf(n) !== -1
          && filteredElementsByUserTypes.indexOf(n) !== -1
      )
    },
    filterCategories() {
      return this.translatedCategories.slice(0, this.lastIndexCategories)
    },
    isMaxShowMoreCategories() {
      return this.translatedCategories.slice(0, this.lastIndexCategories).length >= this.translatedCategories.length
    },
    filterTopics() {
      return this.topics.slice(0, this.lastIndexTopics)
    },
    isMaxShowMoreTopics() {
      return this.topics.slice(0, this.lastIndexTopics).length >= this.topics.length
    },
    filterUserTypes() {
      return this.userTypes.slice(0, this.lastIndexUserTypes)
    },
    isMaxShowMoreUserTypes() {
      return this.userTypes.slice(0, this.lastIndexUserTypes).length >= this.userTypes.length
    }
  },
  created() {
    this.loading = true
    this.lang = this.$i18n.locale
    this.fetchGlossary().then(() => this.initializeList())
  }
}
</script>

<style lang="scss" scoped>
$accent_list: #ff7c44;
$btn_secondary: #cdd0d2;
.add-btn {
  background-color: #0b91ce;
  color: white;
  border-radius: 5px;
  margin-right: 85px;
  margin-top: 65px;
  margin-bottom: 75px;
}
.cat-btn {
  background-color: $accent_list;
  color: white;
  border-radius: 5px;
  margin-top: 65px;
  margin-bottom: 75px;
}
.toolbar-list {
  background-color: $accent_list;
  border-radius: 2px;
}
.title-label {
  font-weight: 600;
  font-family: "Nunito";
  font-size: 20px;
}
.item-btn {
  background-color: white;
}
.tag_btn {
  background-color: $primary;
  width: 110px;
  color: white;
  border-radius: 32px;
}
.category_btn {
  background-color: $btn_secondary;
  text-decoration: underline;
  border: 1px solid $accent_list;
}
.title_section {
  flex: 3000;
}
.icon_btn_section {
  flex: 350;
}
.alphabet {
  color: $primary;
  font-family: "Nunito";
  font-weight: bold;
  cursor: pointer;
}
.filter-text {
  font-family: "Nunito Sans";
  font-weight: 600;
  font-size: 15px;
}
.filter-title {
  font-family: "Nunito Sans";
  font-weight: 600;
  font-size: 20px;
}
.clear_all {
  font-family: "Nunito";
  font-weight: 600;
  font-size: 16px;
}
.show_more {
  font-family: "Nunito";
  font-weight: 600;
  font-size: 12px;
}
.tags_text {
  font-family: "Nunito Sans";
  font-weight: 400;
  font-size: 14px;
}
.date-text {
  font-family: "Nunito";
  font-weight: 300;
}
.element-list {
  overflow-y: scroll;
  max-height: 75vh;
}
.filter-icon {
  max-height: 24px;
  max-width: 24px;
}
.viewer {
  max-width: 100%;
  font-size: 15px;
}
.search-bar {
  border-radius: 5px;
  margin-top: 65px;
  margin-bottom: 75px;
  max-width: 75%;
}
.filter-list {
  margin-top: 65px;
}
</style>
