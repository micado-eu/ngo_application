<template>
  <div>
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{$t(pagetitle)}}</div>
    <span v-if="loading">Loading...</span>
    <div
      class="edit-element-component q-pa-xl q-ma-xl"
      v-else
    >
      <div class="q-ml-xl">
        <span class="q-my-xl label-edit">{{$t('input_labels.title')}}</span>
        <q-input
          class="title_input q-mb-xl"
          outlined
          v-model="internalTitle"
          :rules="[ val => val.length <= 20 || $t('error_messages.max_title')]"
        />
      </div>
      <div class="q-ml-xl">
        <span class="q-my-xl label-edit">{{$t('input_labels.description')}}</span>
        <glossary-editor
          class="desc-editor q-mb-xl"
          v-model="internalDescription"
          :lang="$userLang"
          ref="editor"
        />
      </div>
      <div class="row tag_category_selectors q-ml-xl">
        <div
          v-if="tags_enabled"
          class="q-my-md tag_list col"
        >
          <span class="q-my-xl label-edit">{{$t('input_labels.tags')}}</span>
          <div class="row">
            <q-input
              color="accent"
              outlined
              placeholder="New tag"
              label-color="accent"
              v-model="tagInput"
              class="col-10"
            />
            <q-btn
              no-caps
              @click="addTag()"
              :label="$t('button.add_tag')"
              class="q-my-sm q-ml-sm add_tag_btn col"
            />
            <span
              v-if="tagError"
              class="q-ml-sm"
            >
              {{ $t(tagErrorMessage) }}
            </span>
          </div>
          <div class="tag_list flex">
            <div
              class="tag_btn q-my-sm q-mr-sm"
              v-for="tag in internalTags"
              :key="tag"
            >
              <span>{{tag}} <span
                  class="del_tag_btn"
                  @click="internalTags.splice(internalTags.indexOf(tag), 1)"
                >X</span></span>
            </div>
          </div>
        </div>
        <div
          v-if="categories_enabled"
          class="q-my-md q-ml-lg tag_list col"
        >
          <span class="q-my-lg label-edit">{{$t('input_labels.select_category')}}</span>
          <q-select
            v-model="selectedCategory"
            :options="internalCategories"
            @input="setCategoryObjectModel($event)"
          />
        </div>
      </div>
      <div
        class="row tag_category_selectors q-ml-lg"
        v-if="is_event"
      >
        <div class="q-my-md q-ml-lg tag_list col">
          <span class="q-my-lg label-edit">{{$t('input_labels.start_date')}}</span>
          <q-input
            filled
            v-model="startDate"
          >
            <template v-slot:prepend>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="startDate"
                    mask="YYYY-MM-DD HH:mm"
                    color="accent"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        :label="$t('date_selector.close')"
                        color="accent"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon
                name="access_time"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="startDate"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                    color="accent"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        :label="$t('date_selector.close')"
                        color="accent"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div
          v-if="is_event"
          class="q-my-md q-ml-lg tag_list col"
        >
          <span class="q-my-lg label-edit">{{$t('input_labels.finish_date')}}</span>
          <q-input
            filled
            v-model="finishDate"
          >
            <template v-slot:prepend>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="finishDate"
                    mask="YYYY-MM-DD HH:mm"
                    color="accent"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        :label="$t('date_selector.close')"
                        color="accent"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon
                name="access_time"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="finishDate"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                    color="accent"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        :label="$t('date_selector.close')"
                        color="accent"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row tag_category_selectors q-ml-lg">
        <div
          v-if="topics_enabled"
          class="q-my-md q-ml-lg tag_list col"
        >
          <span class="q-my-lg label-edit">{{$t('input_labels.select_topic')}}</span>
          <q-select
            v-model="selectedTopic"
            :options="internalTopics"
            @input="setTopicObjectModel($event)"
          />
          <div class="tag_list flex">
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
          <span class="q-my-lg label-edit">{{$t('input_labels.select_user_type')}}</span>
          <q-select
            v-model="selectedUserType"
            :options="internalUserTypes"
            @input="setUserTypeObjectModel($event)"
          />
          <div class="tag_list flex">
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
      <div class="language_selector q-ml-xl">
        <hr
          style="border: 0.999px solid #DADADA;"
          class="q-my-lg"
        >
        <q-tabs
          v-model="langTab"
          @input="changeLanguage"
          dense
          class="text-grey"
          active-color="accent"
          indicator-color="accent"
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
      <div class="row q-my-xl q-ml-xl">
        <q-btn
          outline
          no-caps
          color="accent"
          :label="$t('button.cancel')"
          class="q-mr-lg edit-element-button"
          @click="goBack()"
        />
        <q-btn
          unelevated
          no-caps
          color="accent"
          :label="$t('button.save')"
          @click="callSaveFn()"
          class="row edit-element-button"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'EditElement',
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
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    tags_enabled: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      loading: true,
      internalTitle: '',
      internalDescription: '',
      internalTags: [],
      internalCategories: [],
      internalCategoriesObjects: [],
      selectedCategory: '',
      selectedCategoryObject: {},
      tagInput: '',
      tagError: false,
      tagErrorMessage: '',
      langTab: '',
      internalTopics: [],
      internalTopicsObjects: [],
      selectedTopic: '',
      selectedTopicsObjects: [],
      internalUserType: '',
      internalUserTypesObjects: [],
      selectedUserType: '',
      selectedUserTypesObjects: [],
      startDate: '',
      finishDate: '',
      savedTranslations: []
    }
  },
  methods: {
    ...mapActions('language', ['fetchActiveLanguages']),
    ...mapActions('topic', ['fetchTopic']),
    ...mapActions('user_type', ['fetchUserType']),
    changeLanguage(al) {
      this.saveContent()
      this.changeLanguageAux(al)
    },
    changeLanguageAux(al) {
      if (this.elem) {
        const idx = this.elem.translations.findIndex((t) => t.lang === al)
        if (idx !== -1) {
          this.internalTitle = this.elem.translations[idx].title
          const parsedJson = this.elem.translations[idx].description
          this.internalDescription = parsedJson
          if (this.$refs.editor) {
            this.$refs.editor.setContent(parsedJson)
            this.$refs.editor.setLang(al)
          }
        } else {
          this.resetFields(al)
        }
      } else {
        this.resetFields(al)
      }
    },
    saveContent() {
      const idx = this.savedTranslations.findIndex((t) => t.lang === this.langTab)
      const translation = {
        title: this.internalTitle,
        description: JSON.stringify(this.$refs.editor.getContent()),
        lang: this.langTab
      }
      if (this.categories_enabled) {
        translation.category = this.selectedCategoryObject
      }
      if (this.tags_enabled) {
        translation.tags = this.internalTags
      }
      if (this.topics_enabled) {
        translation.topics = this.selectedTopicsObjects
      }
      if (this.user_types_enabled) {
        translation.userTypes = this.selectedUserTypesObjects
      }
      if (this.is_event) {
        translation.startDate = new Date(this.startDate).toISOString()
        translation.finishDate = new Date(this.finishDate).toISOString()
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
      this.internalTags = []
      this.tagInput = ''
      this.setInternalCategorySelector(al)
      this.selectedTopic = ''
      this.setInternalTopicSelector(al)
      this.selectedUserType = ''
      this.setInternalUserTypeSelector(al)
      if (this.$refs.editor) {
        this.$refs.editor.setContent('')
        this.$refs.editor.setLang(al)
      }
    },
    addTag() {
      if (this.internalTags.indexOf(this.tagInput) !== -1) {
        this.tagErrorMessage = 'Duplicates are not allowed.'
        this.tagError = true
      } else if (this.tagInput.length <= 0) {
        this.tagErrorMessage = 'Empty tags are not allowed.'
        this.tagError = true
      } else {
        this.internalTags.push(this.tagInput)
        this.tagError = false
        this.tagInput = ''
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
      return false
    },
    callSaveFn() {
      if (!this.checkErrors()) {
        this.saveContent()
        for (const language of this.activeLanguages) {
          if (this.savedTranslations.findIndex((t) => t.lang === language.lang) == -1) {
            const emptyTranslation = {
              title: '',
              description: '',
              lang: language.lang
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
        if (this.tags_enabled) {
          let largestTagArrayLength = -1
          for (let i = 0; i < this.savedTranslations.length; i += 1) {
            if (!this.savedTranslations[i].tags) {
              this.savedTranslations[i].tags = []
            }
            if (this.savedTranslations[i].tags.length > largestTagArrayLength) {
              largestTagArrayLength = this.savedTranslations[i].tags.length
            }
          }
          for (let i = 0; i < this.savedTranslations.length; i += 1) {
            while (this.savedTranslations[i].tags.length < largestTagArrayLength) {
              this.savedTranslations[i].tags.push('')
            }
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
    ...mapGetters('user_type', ['user'])
  },
  components: {
    'glossary-editor': require('components/GlossaryEditor.vue').default
  },
  created() {
    this.loading = true
    const al = this.$i18n.locale
    this.fetchActiveLanguages().then(() => {
      this.langTab = this.activeLanguages.filter((l) => l.lang === al)[0].lang
      if (this.elem) {
        this.changeLanguageAux(al)
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
          this.startDate = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()} ${startDate.getUTCHours()}:${startDate.getUTCMinutes()}`
          const finishDate = new Date(this.elem.endDate)
          this.finishDate = `${finishDate.getUTCFullYear()}-${finishDate.getUTCMonth() + 1}-${finishDate.getUTCDate()} ${finishDate.getUTCHours()}:${finishDate.getUTCMinutes()}`
        }
      }
      if (this.categories.length > 0) {
        this.setInternalCategorySelector(al)
      }
      if (this.tags.length > 0) {
        for (const tag of this.tags) {
          const idxTag = tag.translations.findIndex((t) => t.lang === al)
          this.internalTags.push(tag.translations[idxTag].tag)
        }
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
                  const idxUserTypeTranslation = this.topic[idxUserType]
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
  max-width: 80%;
}
.add_tag_btn {
  background-color: #0b91ce;
  color: white;
}

.tag_category_selectors {
  max-width: 80%;
}

.language_selector {
  max-width: 80%;
}
</style>
