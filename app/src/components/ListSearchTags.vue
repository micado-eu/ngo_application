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
              <q-item-label class="general-filter-title">{{$t("filters.title")}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
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
            default-opened
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
              dense
            >
              <q-checkbox
                color="accent"
                v-model="selectedTopics"
                :val="topic.id"
                class="filter-text"
                :label="topicTransl(topic)"
                @input="filterByTopics()"
              />
              <q-img
                :src="topic.icon"
                spinner-color="white"
                id="image"
                :alt="topicTransl(topic)"
                class="q-ml-sm q-mt-sm filter-icon"
                :img-style="{'max-width': '24px', 'max-height': '24px'}"
              >
                <q-tooltip :key="'topic_tooltip'.concat(topic.id)">
                  {{topicTransl(topic)}}
                </q-tooltip>
              </q-img>
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
            default-opened
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
              dense
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
            default-opened
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
              dense
            >
              <q-checkbox
                color="accent"
                v-model="selectedUserTypes"
                :val="userType.id"
                class="filter-text"
                :label="userTypeTransl(userType)"
                @input="filterByUserTypes()"
              />
              <q-img
                :src="userType.icon"
                spinner-color="white"
                id="image"
                :alt="userTypeTransl(userType)"
                class="q-ml-sm q-mt-sm filter-icon"
                :img-style="{'max-width': '24px', 'max-height': '24px'}"
              >
                <q-tooltip :key="'userType_tooltip'.concat(userType.id)">
                  {{userTypeTransl(userType)}}
                </q-tooltip>
              </q-img>
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
          <q-separator v-if="is_event" />
          <q-expansion-item
            expand-separator
            default-opened
            v-if="is_event"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="filter-title">
                  {{$t("filters.date_title")}}
                </q-item-label>
              </q-item-section>
            </template>
            <date-time-selector
              @inputDate="selectedDate = $event"
              @inputTime="selectedTime = $event"
              class="q-ma-sm"
            ></date-time-selector>
          </q-expansion-item>
        </q-list>
      </div>
      <div class="q-mx-sm col-10">
        <div class="row">
          <q-input
            color="accent"
            v-model="search"
            debounce="500"
            filled
            outlined
            dense
            :label='$t("input_labels.search")'
            :class="'search-bar col-9'"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            no-caps
            unelevated
            :label='$t(add_label)'
            class="add-btn q-ml-md col"
            data-cy="add_element"
            :to="new_url"
          />
        </div>
        <div class="center q-mr-xl">
          <upload-button
            :entity="entity"
            :creator="getCurrentUser()"
            @uploadSuccess="batchUploadSuccess($event)"
            @uploadError="batchUploadError($event)"
            class="q-mr-sm"
          ></upload-button>
        </div>
        <div class="column-header">
          <!-- column title -->
          <q-list>
            <q-item class="flex row">
              <q-item-section class="flex flex-left col-7"></q-item-section>
              <q-item-section class="flex col-1">
                <div style="text-align:center">{{$t("lists.published")}}</div>
              </q-item-section>
              <q-item-section class="flex col-1">
                <div style="text-align:center">{{$t("lists.translation_state")}}</div>
              </q-item-section>
              <q-item-section class="flex col-1">
                <div style="text-align:center">{{$t("lists.edit")}}</div>
              </q-item-section>
              <q-item-section class="flex col-1">
              </q-item-section>
            </q-item>
          </q-list>
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
              v-for="(item, index) in filteredElements"
              :key="item.id"
              :id="item.id"
              clickable
              class="row"
              @mouseover="hovered = item.id"
              @mouseleave="hovered = -1"
            >
              <q-item-section class="col-7 flex flex-left q-mt-md">
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
                      :alt="topicTransl(topic)"
                      :img-style="{'max-width': '24px', 'max-height': '24px'}"
                      :class="index !== (item.topics.length - 1) ? 'filter-icon q-mr-xs' : 'filter-icon'"
                    >
                      <q-tooltip :key="'topic_tooltip'.concat(topic.id)">
                        {{topicTransl(topic)}}
                      </q-tooltip>
                    </q-img>
                  </span>
                  <span
                    v-if="user_types_enabled && item.userTypes.length > 0"
                    class="q-mr-md tags_text"
                  >
                    {{$t("lists.user_types")}}:
                    <q-img
                      v-for="(userType, index) in item.userTypes"
                      :key="userType.id"
                      :src="userType.icon"
                      spinner-color="white"
                      id="image"
                      :alt="userTypeTransl(userType)"
                      :img-style="{'max-width': '24px', 'max-height': '24px'}"
                      :class="index !== (item.userTypes.length - 1) ? 'filter-icon q-mr-xs' : 'filter-icon'"
                    >
                      <q-tooltip :key="'userType_tooltip'.concat(userType.id)">
                        {{userTypeTransl(userType)}}
                      </q-tooltip>
                    </q-img>
                  </span>
                  <span
                    class="q-mr-md tags_text"
                    v-if="categories_enabled && item.category"
                  >
                    {{$t("lists.category")}}: {{item.category.category}}
                  </span>
                  <span
                    class="tags_text"
                    v-if="is_event"
                  >
                    {{$t("lists.cost")}}: {{item.cost ? item.cost : $t("lists.cost_free")}}
                  </span>
                </div>
                <div
                  class="q-mb-sm"
                  style="display: inline"
                >
                  <span>
                    {{ $t("input_labels.available_transl") }}:
                  </span>
                  <span 
                    v-if="item.availableTranslations.length > 0"
                  >
                    <q-chip
                      v-for="availableLang in item.availableTranslations"
                      :key="availableLang"
                      >{{ availableLang }}
                    </q-chip>
                  </span>
                  <span 
                    v-else
                  >
                    <span>{{ $t("input_labels.no_available_transl") }}</span>
                  </span>
                </div>
                <glossary-editor-viewer
                  class="viewer"
                  :content="item.description ? item.description : ''"
                  v-if="!loading"
                  all_fetched
                  :lang="lang"
                  readMore
                  @readMorePressed=toggleExtraInfo(item.id)
                  @readLessPressed=toggleExtraInfo(item.id)
                >
                  <template v-slot:append>
                    <div>
                      <q-img
                        src="statics/icons/Icon - Calender.svg"
                        spinner-color="white"
                        :img-style="{'max-width': '14px', 'max-height': '14px'}"
                        class="extra-info-icon"
                        v-if="is_event && showExtraInfo[item.id]"
                      />
                      <span
                        class="date-text q-mt-sm q-mr-xl"
                        v-if="is_event && item.startDate && showExtraInfo[item.id]"
                      >
                        {{$t("lists.start_date")}}: {{item.startDate}}
                      </span>
                      <span
                        class="date-text q-mt-sm"
                        v-if="is_event && item.endDate && showExtraInfo[item.id]"
                      >
                        {{$t("lists.end_date")}}: {{item.endDate}}
                      </span>
                    </div>
                    <div class="q-mt-sm">
                      <q-img
                        src="statics/icons/Icon - Location Pin.svg"
                        spinner-color="white"
                        :img-style="{'max-width': '14px', 'max-height': '14px'}"
                        class="extra-info-icon"
                        v-if="is_event && item.location && showExtraInfo[item.id]"
                      />
                      <span
                        class="date-text q-mb-sm"
                        v-if="is_event && item.location && showExtraInfo[item.id]"
                      >
                        {{$t("lists.location")}}: {{item.location}}
                      </span>
                    </div>
                    <div>
                      <span
                        class="date-text q-mt-sm q-mr-xl"
                        v-if="item.creator && showExtraInfo[item.id]"
                      >
                        {{$t("lists.creator")}}:
                        <span>
                          {{getCreatorAttribute(item.creator, "givenName")}} {{getCreatorAttribute(item.creator, "sn")}}
                        </span>
                      </span>
                    </div>
                  </template>
                </glossary-editor-viewer>
              </q-item-section>
              <q-item-section class="col-1 flex flex-center q-mt-md">
                <q-toggle
                  v-model="item.published"
                  color="accent"
                  @input="showWarningPublish($event, item.id, index)"
                  :disable="!item.translationState"
                />
              </q-item-section>
              <q-item-section class="col-1 flex flex-center q-mt-md">
                <div style="text-align:center">{{getTranslationStateText(item.translationState)}}</div>
              </q-item-section>
              <q-item-section class="col-1 flex flex-center q-mt-md">
                <q-btn
                  unelevated
                  class="item-btn"
                  icon="img:statics/icons/Icon - edit - orange (600x600).png"
                  :to="edit_url_fn(item.id)"
                  :data-cy="'edit_button' + item.id"
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
import UploadButton from 'components/UploadButton'
import DateTimeSelector from 'components/DateTimeSelector'

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
    },
    entity: {
      type: String
    },
    on_publish: {
      type: Function
    },
    on_unpublish: {
      type: Function
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
      filteredElementsByDate: [],
      searchText: '',
      topics: [],
      userTypes: [],
      translatedCategories: [],
      selectedCategory: undefined,
      selectedTopics: [],
      selectedUserTypes: [],
      selectedDate: '',
      selectedTime: '',
      lang: '',
      alphabet: [],
      alphabetIds: [],
      lastIndexCategories: 3,
      lastIndexTopics: 3,
      lastIndexUserTypes: 3,
      loading: true,
      showExtraInfo: []
    }
  },
  components: {
    'glossary-editor-viewer': GlossaryEditorViewer,
    'upload-button': UploadButton,
    'date-time-selector': DateTimeSelector
  },
  methods: {
    ...mapActions('glossary', ['fetchGlossaryTemp']),
    ...mapActions('information', ['fetchInformationTemp']),
    ...mapActions('flows', ['fetchFlowsTemp']),
    ...mapActions('event', ['fetchEventTemp']),
    ...mapActions('user', ['fetchSpecificUser']),
    getCurrentUser() {
      if (this.loggedUser) {
        return this.loggedUser?.umid
      }
      else {
        return null
      }
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
          return e.category === this.selectedCategory
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
    filterByDate() {
      if (this.selectedDate) {
        let fullDate
        if (this.selectedTime) {
          fullDate = new Date(this.selectedDate + ' ' + this.selectedTime)
        } else {
          fullDate = new Date(this.selectedDate)
        }
        this.filteredElementsByDate = []
        for (const e of this.translatedElements) {
          const fullStartDate = new Date(e.startDate)
          const fullFinishDate = new Date(e.endDate)
          if (fullDate >= fullStartDate && fullDate <= fullFinishDate) {
            this.filteredElementsByDate.push(e)
          }
        }
      } else {
        this.filteredElementsByDate = this.translatedElements
      }
    },
    compare(a, b) {
      return a.title.localeCompare(b.title, this.lang, { sensitivity: 'base' })
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
      this.filteredElementsByDate = this.translatedElements
      this.selectedTopics = []
      this.selectedUserTypes = []
      this.selectedDate = ''
      this.selectedTime = ''
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
    toggleExtraInfo(id) {
      this.showExtraInfo[id] = !this.showExtraInfo[id]
    },
    batchUploadSuccess(success) {
      this.$emit("batchUpload")
    },
    batchUploadError(err) {
      this.$q.notify({
        type: 'negative',
        message: `Error while uploading: ${err}`
      })
    },
    showWarningPublish(event, id, idx) {
      if (event == true) {
        this.$q.notify({
          type: 'warning',
          timeout: 0,
          message: this.$t("lists.publish_warning"),
          actions: [
            {
              label: this.$t("lists.yes"), color: 'accent', handler: () => {
                this.on_publish(id).then(() => console.log("published"))
              }
            },
            {
              label: this.$t("lists.no"), color: 'red', handler: () => {
                this.filteredElements[idx].published = false
              }
            }
          ]
        })

      }
      else {
        this.$q.notify({
          type: 'warning',
          message: this.$t("lists.unpublish_warning"),
          actions: [
            {
              label: this.$t("lists.yes"), color: 'accent', handler: () => {
                this.on_unpublish(id).then(() => console.log("unpublished"))
              }
            },
            {
              label: this.$t("lists.no"), color: 'red', handler: () => {
                this.filteredElements[idx].published = true
              }
            }
          ]
        })

      }
    },
    async initializeList() {
      let creatorPromises = []
      let creatorPromisesIds = []
      this.translatedElements = this.elements.map((e) => {
        let translation
        if (e.translations) {
          const idx = e.translations.findIndex((t) => (t.lang === this.lang) && !t.translated)
          if (idx !== -1) {
            translation = { ...e.translations[idx] }
            translation.id = e.id // In case of errors we still have the id
            if (this.categories_enabled && e.category) {
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
              translation.startDate = startDate.toLocaleString(this.lang)
              const finishDate = new Date(e.endDate)
              translation.endDate = finishDate.toLocaleString(this.lang)
              translation.location = e.location
              translation.cost = e.cost
            }
            if (e.creator !== null && !creatorPromisesIds.includes(e.creator)) {
              creatorPromisesIds.push(e.creator)
              creatorPromises.push(this.fetchSpecificUser({ userid: e.creator, tenantid: this.$pa_tenant }))
              translation.creator = e.creator
            }
            translation.published = e.published
            this.showExtraInfo[e.id] = false
            translation.availableTranslations = e.translations
              .filter((t) => t.translated)
              .map((t) => t.lang)
            return translation
          } else return undefined
        }
      })
      Promise.all(creatorPromises).then(results => {
        let creatorCache = {}
        if (results.length > 0) {
          creatorCache = results.reduce((curCache, creator) => Object.assign(curCache, {[creator.umId]: creator}, {}))
        }
        this.translatedElements = this.translatedElements.filter((e) => e !== undefined)
        this.translatedElements.forEach(e => e.creator = creatorCache[e.creator])
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
        this.filteredElementsByDate = this.translatedElements
        this.loading = false
      })
    },
    topicTransl(topic) {
      const idx = topic.translations.findIndex((t) => t.lang === this.lang)
      return idx !== -1 ? topic.translations[idx].topic : ''
    },
    userTypeTransl(userType) {
      const idx = userType.translations.findIndex((t) => t.lang === this.lang)
      return idx !== -1 ? userType.translations[idx].userType : ''
    },
    getCreatorAttribute(creator, attrString) {
      let retAttr = ""
      if (creator && creator.attributes) {
        let retAttr_arr = creator.attributes.filter((attr) => attr.umAttrName === attrString)
        if (retAttr_arr.length > 0) {
          retAttr = retAttr_arr[0].umAttrValue
        }
      }
      return retAttr
    },
    getTranslationStateText(translationStateNumber) {
      switch (translationStateNumber) {
        case 0: return this.$t("translation_states.editing")
        case 1: return this.$t("translation_states.translatable")
        case 2: return this.$t("translation_states.translating")
        case 3: return this.$t("translation_states.translated")
        default: return this.$t("translation_states.unknown")
      }
    }
  },
  watch: {
    selectedDate(val) {
      this.filterByDate()
    },
    selectedTime(val) {
      this.filterByDate()
    }
  },
  computed: {
    ...mapGetters('topic', ['topic']),
    ...mapGetters('user_type', ['user']),
    ...mapGetters({ loggedUser: 'auth/user' }),
    search: {
      get() {
        return this.searchText
      },
      set(newSearch) {
        if (newSearch) {
          let keys = ['title', 'description']
          if (this.is_event) {
            keys.push('location')
          }
          const fuse = new Fuse(this.translatedElements, {
            keys
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
      const { filteredElementsByDate } = this
      return this.filteredElementsBySearch.filter(
        (n) => filteredElementsByCategory.indexOf(n) !== -1
          && filteredElementsByTopics.indexOf(n) !== -1
          && filteredElementsByUserTypes.indexOf(n) !== -1
          && filteredElementsByDate.indexOf(n) !== -1
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
    this.lang = this.$defaultLang
    const langs = { defaultLang: this.$defaultLang, userLang: this.$userLang }
    Promise.all([
      this.fetchGlossaryTemp(langs),
      this.fetchInformationTemp(langs),
      this.fetchFlowsTemp(langs),
      this.fetchEventTemp(langs)
    ]).then(this.initializeList())
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
  margin-right: 108px;
  margin-top: 65px;
  margin-bottom: 25px;
}
.cat-btn {
  background-color: $accent_list;
  color: white;
  border-radius: 5px;
  margin-top: 65px;
  margin-bottom: 25px;
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
.general-filter-title {
  font-family: "Nunito Sans";
  font-weight: 700;
  font-size: 20px;
}
.filter-title {
  font-family: "Nunito Sans";
  font-weight: bold;
  font-size: 15px;
}
.clear_all {
  font-family: "Nunito";
  font-weight: 600;
  font-size: 12px;
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
.extra-info-icon {
  max-height: 14px;
  max-width: 14px;
}
.viewer {
  max-width: 100%;
  font-size: 15px;
}
.search-bar {
  border-radius: 5px;
  margin-top: 65px;
  margin-bottom: 25px;
  max-width: 75%;
  max-height: 40px;
}
.filter-list {
  margin-top: 65px;
}
.column-header {
  max-width: 91.6667%;
}
</style>
