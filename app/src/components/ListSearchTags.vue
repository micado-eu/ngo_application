<template>
  <div>
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{$t(title)}}</div>
    <span v-if="loading">Loading...</span>
    <div
      class="row"
      v-show=!loading
    >
      <div class="col q-mt-md q-ml-md">
        <q-list
          bordered
          v-if="tags_enabled || categories_enabled || topics_enabled || user_types_enabled"
        >
          <q-item>
            <q-item-section>
              <q-item-label class="title-label">{{$t("filters.title")}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <a
                href="javascript:void(0)"
                @click="clearFilters()"
              >
                {{$t("filters.clear_all")}}
              </a>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="tags_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="title-label">{{$t("filters.tags_title")}}</q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="tag in filterTags"
              :key="tag"
            >
              <q-checkbox
                color="accent"
                v-model="selectedTags"
                :val="tag"
                :label="tag"
                class="filter-text"
                @input="filterByTags()"
              />
            </q-item>
            <q-item>
              <a
                href="javascript:void(0)"
                class="filter-text"
                @click="showMoreTags()"
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
                <q-item-label class="title-label">{{$t("filters.category_title")}}</q-item-label>
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
            <q-item>
              <a
                href="javascript:void(0)"
                class="filter-text"
                @click="showMoreCategories()"
              >
                {{$t("filters.show_more")}}
              </a>
            </q-item>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="topics_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="title-label">{{$t("filters.topics_title")}}</q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="topic in topics"
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
              <q-img
                :src="topic.icon"
                spinner-color="white"
                id="image"
                :alt="topic.topic"
                class="q-ml-sm filter-icon"
              />
            </q-item>
            <q-item>
              <a
                href="javascript:void(0)"
                class="filter-text"
                @click="showMoreTopics()"
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
                <q-item-label class="title-label">{{$t("filters.user_types_title")}}</q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="userType in userTypes"
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
              <q-img
                :src="userType.icon"
                spinner-color="white"
                id="image"
                :alt="userType.user_type"
                class="q-ml-sm filter-icon"
              />
            </q-item>
            <q-item>
              <a
                href="javascript:void(0)"
                class="filter-text"
                @click="showMoreUserTypes()"
              >
                {{$t("filters.show_more")}}
              </a>
            </q-item>
          </q-expansion-item>
        </q-list>
      </div>
      <div class="q-mx-sm col-10">
        <div class="q-my-md q-mr-md row">
          <q-input
            color="accent"
            v-model="search"
            debounce="500"
            filled
            outlined
            :label='$t("input_labels.search")'
            class="col-10"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            outlined
            no-caps
            :label='$t(add_label)'
            class="add-btn col q-ml-md"
            :to="new_url"
          />
        </div>
        <div
          class="flex"
          v-if="categories_enabled || tags_enabled"
        >
          <!-- column title -->
          <span
            v-if="categories_enabled"
            style="flex:4200"
          />
          <span
            v-if="categories_enabled"
            style="flex:2100"
          >
            {{$t("lists.category")}}
          </span>
          <span
            v-if="tags_enabled"
            style="flex:1350"
          >
            {{$t("lists.tags")}}
          </span>
          <span
            v-if="topics_enabled"
            style="flex:1450"
          >
            {{$t("lists.topics")}}
          </span>
          <span
            v-if="user_types_enabled"
            style="flex:3250"
          >
            {{$t("lists.user_types")}}
          </span>
        </div>
        <div class="row">
          <q-separator
            v-if="categories_enabled || tags_enabled"
            style="max-width: 91.7%"
          />
        </div>
        <div class="row">
          <q-list class="q-mt-md col-11 element-list">
            <!-- items -->
            <q-item
              v-for="item in filteredElements"
              :key="item.id"
              :id="item.id"
              clickable
              @mouseover="hovered = item.id"
              @mouseleave="hovered = -1"
            >
              <q-item-section class="title_section">
                <q-item-label class="title-label">
                  {{ item.title }}
                </q-item-label>
                <glossary-editor-viewer
                  class="viewer"
                  :content="item.description"
                  v-if="!loading"
                  glossary_fetched
                  :lang="lang"
                />
                <span
                  class="filter-text"
                  v-if="is_event"
                >
                  {{$t("lists.start_date")}}: {{item.startDate}}
                </span>
                <span
                  class="filter-text"
                  v-if="is_event"
                >
                  {{$t("lists.end_date")}}: {{item.endDate}}
                </span>
              </q-item-section>
              <q-item-section
                class="category_section"
                v-if="categories_enabled"
              >
                {{item.category.category}}
              </q-item-section>
              <q-item-section class="tag_btn_section">
                <q-btn
                  no-caps
                  v-for="tag in item.tags"
                  :key="tag.id"
                  :label="tag.tag"
                  class="q-mb-sm tag_btn"
                />
              </q-item-section>
              <q-item-section class="tag_btn_section">
                <q-img
                  v-for="topic in item.topics"
                  :key="topic.id"
                  :src="topic.icon"
                  spinner-color="white"
                  id="image"
                  :alt="topic.topic"
                  class="filter-icon"
                />
              </q-item-section>
              <q-item-section class="tag_btn_section">
                <q-img
                  v-for="userType in item.userTypes"
                  :key="userType.id"
                  :src="userType.icon"
                  spinner-color="white"
                  id="image"
                  :alt="userType.topic"
                  class="filter-icon"
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
                  icon="img:statics/icons/MICADO-Edit Icon - Black (600x600) transparent.png"
                  :to="edit_url_fn(item.id)"
                />
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
    tags_enabled: {
      type: Boolean,
      default: false
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
      filteredElementsByTags: [],
      filteredElementsByCategory: [],
      filteredElementsByTopic: [],
      filteredElementsByUserType: [],
      searchText: '',
      tags: [],
      topics: [],
      userTypes: [],
      translatedCategories: [],
      selectedTags: [],
      selectedCategory: undefined,
      selectedTopics: [],
      selectedUserTypes: [],
      lang: '',
      alphabet: [],
      alphabetIds: [],
      lastIndexTags: 5,
      lastIndexCategories: 5,
      lastIndexTopics: 5,
      lastIndexUserTypes: 5,
      loading: true
    }
  },
  components: {
    'glossary-editor-viewer': GlossaryEditorViewer
  },
  methods: {
    ...mapActions('topic', ['fetchTopic']),
    ...mapActions('user_type', ['fetchUserType']),
    ...mapActions('glossary', ['fetchGlossary']),
    addOrRemoveSelectedCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = undefined
      } else {
        this.selectedCategory = category
      }
      this.filterByCategory()
    },
    filterByTags() {
      if (this.selectedTags.length > 0) {
        this.filteredElementsByTags = []
        for (const e of this.translatedElements) {
          const matchedTags = []
          for (const tag of this.selectedTags) {
            if (e.tags) {
              for (const elemTag of e.tags) {
                if (elemTag.tag === tag) {
                  // This check avoids duplicate matches
                  if (matchedTags.indexOf(tag) == -1) {
                    matchedTags.push(tag)
                  }
                }
              }
            }
          }
          if (matchedTags.length == this.selectedTags.length) {
            this.filteredElementsByTags.push(e)
          }
        }
      } else {
        this.filteredElementsByTags = this.translatedElements
      }
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
    filterByTopic() {
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
    filterByUserType() {
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
            this.filteredElementsByTopics.push(e)
          }
        }
      } else {
        this.filteredElementsByTopics = this.translatedElements
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
      this.selectedTags = []
      this.selectedCategory = undefined
      this.filteredElementsByTags = this.translatedElements
      this.filteredElementsByCategory = this.translatedElements
      this.filteredElementsByTopic = this.translatedElements
      this.filteredElementsByUserType = this.translatedElements
      this.selectedTopics = []
      this.selectedUserTypes = []
    },
    showMoreTags() {
      this.lastIndexTags += 5
    },
    showMoreCategories() {
      this.lastIndexCategories += 5
    },
    showMoreTopics() {
      this.lastIndexTopics += 5
    },
    showMoreUserTypes() {
      this.lastIndexUserTypes += 5
    },
    initializeList() {
      this.translatedElements = this.elements.map((e) => {
        let translation
        if (e.translations) {
          const idx = e.translations.findIndex((t) => t.lang === this.lang)
          translation = { ...e.translations[idx] }
          if (this.categories_enabled) {
            const idxCat = e.category.translations.findIndex((t) => t.lang === this.lang)
            translation.category = e.category.translations[idxCat]
            if (this.translatedCategories.indexOf(translation.category) == -1) {
              this.translatedCategories.push(translation.category)
            }
          }
          if (this.tags_enabled) {
            // Tags
            if (e.tags.length > 0) {
              const tagTranslations = []
              for (const tag of e.tags) {
                const translations = tag.translations.filter((tag) => tag.lang === this.lang)
                if (translations.length > 0) {
                  tagTranslations.push(translations[0])
                  if (this.tags.indexOf(translations[0].tag) == -1) {
                    this.tags.push(translations[0].tag)
                  }
                }
              }
              translation.tags = tagTranslations
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
        }
        return translation
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
      this.filteredElementsByTags = this.translatedElements
      this.filteredElementsByCategory = this.translatedElements
      this.filteredElementsByTopic = this.translatedElements
      this.filteredElementsByUserType = this.translatedElements
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
      const { filteredElementsByTags } = this
      const { filteredElementsByCategory } = this
      const { filteredElementsByTopic } = this
      const { filteredElementsByUserType } = this
      return this.filteredElementsBySearch.filter(
        (n) => filteredElementsByTags.indexOf(n) !== -1
          && filteredElementsByCategory.indexOf(n) !== -1
          && filteredElementsByTopic.indexOf(n) !== -1
          && filteredElementsByUserType.indexOf(n) !== -1
      )
    },
    filterTags() {
      return this.tags.slice(0, this.lastIndexTags)
    },
    filterCategories() {
      return this.translatedCategories.slice(0, this.lastIndexCategories)
    }
  },
  created() {
    this.loading = true
    this.lang = this.$i18n.locale
    const promises = []
    promises.push(this.fetchGlossary())
    if (this.topics_enabled) {
      promises.push(this.fetchTopic())
    }
    if (this.user_types_enabled) {
      promises.push(this.fetchUserType())
    }
    Promise.all(promises).then(() => this.initializeList())
  }
}
</script>

<style lang="scss" scoped>
$accent_list: #ff7c44;
$btn_secondary: #cdd0d2;
.add-btn {
  color: $accent_list;
  border: 1px solid $accent_list;
  border-radius: 2px;
}
.toolbar-list {
  background-color: $accent_list;
  border-radius: 2px;
}
.title-label {
  font-weight: bold;
  font-family: "Nunito";
  font-size: 15pt;
}
.item-btn {
  background-color: $btn_secondary;
}
.tag_btn {
  background-color: $primary;
  width: 110px;
  color: white;
  border-radius: 32px;
}
.published {
  opacity: 1;
}
.unpublished {
  opacity: 0.5;
}
.publish_section {
  flex: 500;
}
.title_section {
  flex: 3000;
}
.tag_btn_section {
  flex: 1000;
}
.category_section {
  flex: 1500;
}
.icon_btn_section {
  flex: 350;
}
.col_title_section {
  flex: 650;
}
.alphabet {
  color: $primary;
  font-family: "Nunito";
  font-weight: bold;
  cursor: pointer;
}
.filter-text {
  font-family: "Nunito";
  font-weight: normal;
}
.element-list {
  overflow-y: scroll;
  max-height: 75vh;
}
.filter-icon {
  max-height: 30px;
  max-width: 30px;
}
.viewer {
  max-width: 100%;
}
</style>
