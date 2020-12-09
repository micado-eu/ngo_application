<template>
  <div>
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{$t(pagetitle)}}</div>
    <span v-if="loading">Loading...</span>
    <div
      class="edit-element-component q-pa-xl q-ma-xl"
      v-else
    >
      <div class="center-edit q-ma-xl">
        <span
          class="warning-error"
          v-if="errorDefaultLangEmpty"
        >{{$t("error_messages.fill_default_language")}} {{$defaultLangString}}</span>
        <span
          class="warning-error"
          v-if="selectedTranslationState === 3"
        >{{$t("error_messages.in_translation")}}</span>
        <span
          class="warning-error"
          v-if="(selectedTranslationState === 4) && elem.published"
        >{{$t("error_messages.change_translated")}}</span>
        <div>
          <span class="q-my-xl label-edit">
            <help-label
              :fieldLabel="$t('input_labels.title')"
              :helpLabel="$t('help.element_title')"
            ></help-label>
          </span>
          <q-input
            class="title_input q-mb-xl"
            data-cy="title_input"
            outlined
            v-model="internalTitle"
            bg-color="grey-3"
            :rules="[ val => val.length <= title_max_length || $t('error_messages.max_char_limit') + title_max_length]"
          />
        </div>
        <div>
          <span class="q-my-xl label-edit">
            <help-label
              :fieldLabel="$t('input_labels.description')"
              :helpLabel="$t('help.element_description')"
            ></help-label>
          </span>
          <glossary-editor
            class="desc-editor q-mb-xl"
            data-cy="description_input"
            v-model="internalDescription"
            :maxCharLimit="description_max_length"
            ref="editor"
          />
        </div>
        <div class="row tag_category_selectors">
          <translate-state-button
            v-model="selectedTranslationState"
            :isForDefaultLanguage="langTab===$defaultLang"
            :objectId="elemId"
            :readonly="!(langTab===$defaultLang)"
            @micado-change="(a) => {selectedTranslationState = a.state}"
          />
        </div>
        <div class="row tag_category_selectors">
          <div
            v-if="categories_enabled"
            class="q-my-md q-ml-lg tag_list col"
          >
            <span class="q-my-lg label-edit">
              <help-label
                :fieldLabel="$t('input_labels.select_category')"
                :helpLabel="$t('help.element_category')"
              ></help-label>
            </span>
            <q-select
              v-model="selectedCategory"
              :options="internalCategories"
              @input="setCategoryObjectModel($event)"
              data-cy="category_select"
            />
          </div>
        </div>
        <div
          class="row tag_category_selectors"
          v-if="is_event"
        >
          <div class="q-my-md q-mr-lg tag_list col">
            <span class="q-my-lg label-edit">
              <help-label
                :fieldLabel="$t('input_labels.start_date')"
                :helpLabel="$t('help.element_start_date')"
              ></help-label>
            </span>
            <div class="row">
              <q-input
                outlined
                bg-color="grey-3"
                v-model="startDate"
                class="col q-mr-md"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                    data-cy="start_date_icon"
                  >
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="startDate"
                        mask="YYYY-MM-DD"
                        color="accent"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('date_selector.close')"
                            color="accent"
                            flat
                            data-cy="close_date_menu"
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                outlined
                bg-color="grey-3"
                v-model="startTime"
                class="col"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="access_time"
                    class="cursor-pointer"
                    data-cy="start_time_icon"
                  >
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="startTime"
                        mask="HH:mm"
                        format24h
                        color="accent"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('date_selector.close')"
                            color="accent"
                            flat
                            data-cy="close_date_menu"
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="q-my-md tag_list col">
            <span class="q-my-lg label-edit">
              <help-label
                :fieldLabel="$t('input_labels.finish_date')"
                :helpLabel="$t('help.element_end_date')"
              ></help-label>
            </span>
            <div class="row">
              <q-input
                outlined
                bg-color="grey-3"
                v-model="finishDate"
                class="col q-mr-md"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                    data-cy="end_date_icon"
                  >
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="finishDate"
                        mask="YYYY-MM-DD"
                        color="accent"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('date_selector.close')"
                            color="accent"
                            flat
                            data-cy="close_date_menu"
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                outlined
                bg-color="grey-3"
                v-model="finishTime"
                class="col"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="access_time"
                    class="cursor-pointer"
                    data-cy="end_time_icon"
                  >
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="finishTime"
                        mask="HH:mm"
                        format24h
                        color="accent"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('date_selector.close')"
                            color="accent"
                            flat
                            data-cy="close_date_menu"
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <div class="row tag_category_selectors">
          <div
            v-if="topics_enabled"
            class="q-my-md tag_list col"
          >
            <span class="q-my-lg label-edit">
              <help-label
                :fieldLabel="$t('input_labels.select_topic')"
                :helpLabel="$t('help.element_topic')"
              ></help-label>
            </span>
            <q-select
              v-model="selectedTopic"
              :options="internalTopics"
              @input="setTopicObjectModel($event)"
              data-cy="topic_select"
            />
            <div
              class="tag_list flex"
              data-cy="topic_list"
            >
              <div
                class="tag_btn q-my-sm q-mr-sm"
                v-for="(topic, idx) in selectedTopicsObjects"
                :key="idx"
              >
                <span>{{topic.topic}} <span
                    class="del_tag_btn"
                    @click="removeTopic(idx)"
                  >X</span></span>
              </div>
            </div>
          </div>
          <div
            v-if="user_types_enabled"
            class="q-my-md q-ml-lg tag_list col"
          >
            <span class="q-my-lg label-edit">
              <help-label
                :fieldLabel="$t('input_labels.select_user_type')"
                :helpLabel="$t('help.element_user_type')"
              ></help-label>
            </span>
            <q-select
              v-model="selectedUserType"
              :options="internalUserTypes"
              @input="setUserTypeObjectModel($event)"
              data-cy="user_types_select"
            />
            <div
              class="tag_list flex"
              data-cy="user_types_list"
            >
              <div
                class="tag_btn q-my-sm q-mr-sm"
                v-for="(userType, idx) in selectedUserTypesObjects"
                :key="idx"
              >
                <span>{{userType.userType}} <span
                    class="del_tag_btn"
                    @click="removeUserType(idx)"
                  >X</span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="language_selector">
          <hr
            style="border: 0.999px solid #DADADA;"
            class="q-my-lg"
          >
          <q-tabs
            v-model="langTab"
            dense
            class="text-grey"
            active-color="black"
            indicator-color="black"
            align="justify"
            narrow-indicator
          >
            <q-tab
              v-for="language in activeLanguages"
              :key="language.lang"
              :name="language.lang"
              :label="language.name"
            />
          </q-tabs>
          <hr
            style="border: 0.999px solid #DADADA"
            class="q-my-lg"
          >
        </div>
        <div class="row">
          <span class="label-edit">
            <help-label
              :fieldLabel="$t('input_labels.is_published')"
              :helpLabel="$t('help.is_published')"
            ></help-label>
            <q-toggle
              v-model="published"
              color="green"
            ></q-toggle>
          </span>
        </div>
        <div class="row q-my-xl">
          <q-btn
            unelevated
            no-caps
            :label="$t('button.cancel')"
            class="q-mr-lg edit-element-button cancel-btn"
            @click="goBack()"
          />
          <q-btn
            unelevated
            no-caps
            color="accent"
            data-cy="save_button"
            :label="$t('button.save')"
            @click="callSaveFn()"
            class="row edit-element-button"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HelpLabel from './HelpLabel'
import GlossaryEditor from './GlossaryEditor'
import TranslateStateButton from './shared/translatestatebutton/TranslateStateButton'

export default {
  name: 'EditElement',
  components: {
    'help-label': HelpLabel,
    'glossary-editor': GlossaryEditor,
    'translate-state-button': TranslateStateButton
  },
  props: {
    pagetitle: {
      type: String,
      default: ''
    },
    elem: {
      type: Object
    },
    save_item_fn: {
      type: Function
    },
    categories: {
      type: Array,
      default() {
        return []
      }
    },
    categories_enabled: {
      type: Boolean,
      default: false
    },
    topics_enabled: {
      type: Boolean,
      default: false
    },
    topics: {
      type: Array,
      default() {
        return []
      }
    },
    user_types_enabled: {
      type: Boolean,
      default: false
    },
    user_types: {
      type: Array,
      default() {
        return []
      }
    },
    is_event: {
      type: Boolean,
      default: false
    },
    title_max_length: {
      type: Number,
      default: 20
    },
    description_max_length: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      internalTitle: '',
      internalDescription: '',
      internalCategories: [],
      internalCategoriesObjects: [],
      selectedCategory: '',
      selectedCategoryObject: {},
      langTab: '',
      internalTopics: [],
      internalTopicsObjects: [],
      selectedTopic: '',
      selectedTopicsObjects: [],
      internalUserType: '',
      internalUserTypesObjects: [],
      selectedUserType: '',
      selectedUserTypesObjects: [],
      selectedTranslationState: 0,
      elemId: -1,
      startDate: '',
      startTime: '',
      finishDate: '',
      finishTime: '',
      savedTranslations: [],
      published: false
    }
  },
  methods: {
    ...mapActions('language', ['fetchActiveLanguages']),
    ...mapActions('topic', ['fetchTopic']),
    ...mapActions('user_type', ['fetchUserType']),
    changeLanguage(newLang, oldLang) {
      this.saveContent(oldLang)
      this.changeLanguageAux(newLang)
    },
    changeLanguageAux(al) {
      const idx = this.savedTranslations.findIndex((t) => t.lang === al)
      if (idx !== -1) {
        const element = this.savedTranslations[idx]
        this.setContent(element, al)
      } else {
        if (this.elem) {
          const idx = this.elem.translations.findIndex((t) => t.lang === al)
          if (idx !== -1) {
            this.setContent(this.elem.translations[idx], al)
          } else {
            this.resetFields(al)
          }
        } else {
          this.resetFields(al)
        }
      }
    },
    setContent(element, al) {
      this.internalTitle = element.title
      this.internalDescription = element.description
      if (this.$refs.editor) {
        this.$refs.editor.setContent(this.internalDescription)
      }
    },
    saveContent(lang) {
      const idx = this.savedTranslations.findIndex((t) => t.lang === lang)
      const translation = {
        title: this.internalTitle,
        description: this.$refs.editor.getContent(),
        lang,
        published: this.published,
        translationState: this.selectedTranslationState
      }
      if (this.categories_enabled) {
        translation.category = this.selectedCategoryObject
      }
      if (this.topics_enabled) {
        translation.topics = this.selectedTopicsObjects
      }
      if (this.user_types_enabled) {
        translation.userTypes = this.selectedUserTypesObjects
      }
      if (this.is_event) {
        translation.startDate = new Date(this.startDate + " " + this.startTime).toISOString()
        translation.finishDate = new Date(this.finishDate + " " + this.finishTime).toISOString()
      }
      if (idx !== -1) {
        this.savedTranslations[idx] = translation
      } else {
        this.savedTranslations.push(translation)
      }
    },
    resetFields(al) {
      this.internalTitle = ''
      this.internalDescription = ''
      if (this.$refs.editor) {
        this.$refs.editor.setContent('')
      }
    },
    setInternalCategorySelector(al) {
      this.internalCategories = this.categories.map((ic) => {
        const idx = ic.translations.findIndex((t) => t.lang === al)
        const translation = ic.translations[idx]
        this.internalCategoriesObjects.push(translation)
        let { category } = translation
        if (!category || category.length <= 0) {
          category = this.$t('input_labels.not_translated')
        }
        if (this.selectedCategoryObject.id === translation.id) {
          this.selectedCategoryObject = translation
        }
        return category
      })
    },
    setInternalTopicSelector(al) {
      this.internalTopics = this.topic.map((ic) => {
        const idx = ic.translations.findIndex((t) => t.lang === al)
        const translation = ic.translations[idx]
        this.internalTopicsObjects.push(translation)
        let { topic } = translation
        if (!topic || topic.length <= 0) {
          topic = this.$t('input_labels.not_translated')
        }
        const idxSelectedTopic = this.selectedTopicsObjects.findIndex(
          (st) => translation.id === st.id
        )
        if (idxSelectedTopic !== -1) {
          this.selectedTopicsObjects[idxSelectedTopic] = translation
        }
        return topic
      })
    },
    setInternalUserTypeSelector(al) {
      this.internalUserTypes = this.user.map((ic) => {
        const idx = ic.translations.findIndex((t) => t.lang === al)
        const translation = ic.translations[idx]
        this.internalUserTypesObjects.push(translation)
        let { userType } = translation
        if (!userType || userType.length <= 0) {
          userType = this.$t('input_labels.not_translated')
        }
        const idxSelectedUserType = this.selectedUserTypesObjects.findIndex(
          (st) => translation.id === st.id
        )
        if (idxSelectedUserType !== -1) {
          this.selectedUserTypesObjects[idxSelectedUserType] = translation
        }
        return userType
      })
    },
    setCategoryObjectModel(category) {
      const idx = this.internalCategoriesObjects.findIndex(
        (t) => t.category === category
      )
      this.selectedCategoryObject = this.internalCategoriesObjects[idx]
    },
    setTopicObjectModel(topic) {
      const idx = this.internalTopicsObjects.findIndex(
        (t) => t.topic === topic
      )
      const topicObj = this.internalTopicsObjects[idx]
      const idxSelected = this.selectedTopicsObjects.findIndex((st) => st.topic === topicObj.topic)
      if (idxSelected === -1) {
        this.selectedTopicsObjects.push(topicObj)
      }
    },
    setUserTypeObjectModel(userType) {
      const idx = this.internalUserTypesObjects.findIndex(
        (t) => t.userType === userType
      )
      const userTypeObj = this.internalUserTypesObjects[idx]
      const idxSelected = this.selectedUserTypesObjects
        .findIndex((st) => st.userType === userTypeObj.userType)
      if (idxSelected === -1) {
        this.selectedUserTypesObjects.push(userTypeObj)
      }
    },
    removeTopic(idx) {
      this.selectedTopicsObjects.splice(
        idx, 1
      )
    },
    removeUserType(idx) {
      this.selectedUserTypesObjects.splice(
        idx, 1
      )
    },
    goBack() {
      this.$router.go(-1)
    },
    checkErrors() {
      if (this.selectedTranslationState >= 3) {
        return true
      }
      if (this.errorDefaultLangEmpty) {
        return true
      }
      if (this.internalTitle.length <= 0) {
        return true
      }
      if (
        this.categories_enabled
        && Object.keys(this.selectedCategoryObject).length === 0
        && this.selectedCategoryObject.constructor === Object
      ) {
        return true
      }
      return this.$refs.editor.hasError()
    },
    callSaveFn() {
      if (!this.checkErrors()) {
        this.saveContent(this.langTab)
        for (const language of this.activeLanguages) {
          if (this.savedTranslations.findIndex((t) => t.lang === language.lang) === -1) {
            const emptyTranslation = {
              title: '',
              description: '',
              lang: language.lang,
              translationState: this.selectedTranslationState
            }
            if (this.categories_enabled) {
              emptyTranslation.category = this.selectedCategoryObject
            }
            if (this.topics_enabled) {
              emptyTranslation.topics = this.selectedTopicsObjects
            }
            if (this.user_types_enabled) {
              emptyTranslation.userTypes = this.selectedUserTypesObjects
            }
            this.savedTranslations.push(emptyTranslation)
          }
        }
        this.save_item_fn(
          this.savedTranslations
        )
      }
    }
  },
  computed: {
    ...mapGetters('language', ['activeLanguages']),
    ...mapGetters('topic', ['topic']),
    ...mapGetters('user_type', ['user']),
    errorDefaultLangEmpty: function () {
      if (this.langTab !== this.$defaultLang) {
        return !this.savedTranslations.filter((t) => t.lang === this.$defaultLang)[0].title
      }
      return !this.internalTitle
    }
  },
  watch: {
    langTab: function (newVal, oldVal) {
      if (newVal && oldVal) {
        this.changeLanguage(newVal, oldVal)
      }
    }
  },
  created() {
    this.loading = true
    const al = this.$i18n.locale
    this.fetchActiveLanguages().then(() => {
      this.langTab = this.activeLanguages.filter((l) => l.lang === al)[0].lang
      if (this.elem) {
        this.changeLanguageAux(al)
        this.published = this.elem.published
        this.elemId = this.elem.id
        this.selectedTranslationState = this.elem.translations[0].translationState
        if (this.categories_enabled) {
          const idxCat = this.categories.findIndex(
            (ic) => ic.id === this.elem.category
          )
          const idxTranslation = this.categories[idxCat].translations.findIndex(
            (t) => t.lang === al
          )
          this.selectedCategoryObject = this.categories[idxCat].translations[
            idxTranslation
          ]
          this.selectedCategory = this.selectedCategoryObject.category
        }
        if (this.is_event) {
          const startDate = new Date(this.elem.startDate)
          this.startDate = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()}`
          this.startTime = `${startDate.getUTCHours()}:${startDate.getUTCMinutes()}`
          const finishDate = new Date(this.elem.endDate)
          this.finishDate = `${finishDate.getUTCFullYear()}-${finishDate.getUTCMonth() + 1}-${finishDate.getUTCDate()}`
          this.finishTime = `${finishDate.getUTCHours()}:${finishDate.getUTCMinutes()}`
        }
      }
      if (this.categories.length > 0) {
        this.setInternalCategorySelector(al)
      }
      if (this.topics_enabled) {
        this.fetchTopic().then(() => {
          if (this.elem && this.topics.length > 0) {
            for (let i = 0; i < this.topics.length; i += 1) {
              const idTopic = this.topics[i]
              const idxTopic = this.topic.findIndex((t) => t.id === idTopic)
              const idxTopicTranslation = this.topic[idxTopic]
                .translations
                .findIndex((t) => t.lang === al)
              this.selectedTopicsObjects
                .push(this.topic[idxTopic].translations[idxTopicTranslation])
            }
          }
          if (this.topic.length > 0) {
            this.setInternalTopicSelector(al)
          }
          if (this.user_types_enabled) {
            this.fetchUserType().then(() => {
              if (this.elem && this.user_types.length > 0) {
                for (let i = 0; i < this.user_types.length; i += 1) {
                  const idUserType = this.user_types[i]
                  const idxUserType = this.user.findIndex((t) => t.id === idUserType)
                  const idxUserTypeTranslation = this.user[idxUserType]
                    .translations
                    .findIndex((t) => t.lang === al)
                  this.selectedUserTypesObjects
                    .push(this.user[idxUserType].translations[idxUserTypeTranslation])
                }
              }
              if (this.user.length > 0) {
                this.setInternalUserTypeSelector(al)
              }
              this.loading = false
            })
          } else {
            this.loading = false
          }
        })
      } else {
        this.loading = false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
$btn_secondary: #cdd0d2;
$title_font_size: 16px;
.edit-element-component {
  border: 1px solid $btn_secondary;
  border-radius: 10px;
}
.edit-element-button {
  border-radius: 5px;
  width: 135.33px;
  height: 50.59px;
}

.label-edit {
  font-family: "Nunito";
  font-size: 16px;
  font-weight: 600;
}
.tag_list {
  flex-direction: row;
}
.tag_btn {
  background-color: $btn_secondary;
  border-radius: 32px;
  padding: 3px 12px;
  font-family: "Nunito";
}
.del_tag_btn {
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.title_input {
  font-size: $title_font_size;
  max-width: 100%;
}
.add_tag_btn {
  background-color: #0b91ce;
  color: white;
}

.tag_category_selectors {
  max-width: 100%;
}

.language_selector {
  max-width: 100%;
}

.cancel-btn {
  border: 1px solid #c71f40;
  color: black;
  font-weight: bold;
}

.center-edit {
  max-width: 100%;
}

.warning-error {
  font-weight: bold;
}
</style>
<style>
.desc-editor .editor-options {
  width: 100%;
}
</style>