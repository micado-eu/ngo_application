<template>
  <div>
    <div
      class="image "
      style="text-align:center"
    >
      <div
        class="top-div"
        style=""
      >
        {{ $t(pagetitle) }}
      </div>
    </div>
    <hr style="border: 1px solid #0F3A5D">
    <span v-if="loading">Loading...</span>
    <div
      class="edit-element-component q-pa-xl q-ma-xl"
      v-else
    >
      <div class="center-edit q-mx-xl">
        <div
          class="warning-error-row row"
          v-if="errorDateTimeEmpty"
        >
          <span class="col"></span>
          <span class="warning-error col">
            {{$t("error_messages.date_time_empty")}}
          </span>
          <span class="col"></span>
        </div>
        <div class="q-mb-md">
          <span class="label-edit">
            <help-label
              :fieldLabel="$t('input_labels.title') + ' *'"
              :helpLabel="$t('help.element_title')"
            ></help-label>
          </span>
          <q-input
            class="title_input"
            data-cy="title_input"
            outlined
            v-model="internalTitle"
            bg-color="grey-3"
            counter
            :maxlength="title_max_length"
            :rules="[ val => val.length <= title_max_length || $t('error_messages.max_char_limit') + title_max_length]"
            :readonly="published || translatable"
          />
        </div>
        <div class="q-my-md">
          <span class="q-my-md label-edit">
            <help-label
              :fieldLabel="$t('input_labels.description')"
              :helpLabel="$t('help.element_description')"
            ></help-label>
          </span>
          <glossary-editor
            class="desc-editor"
            data-cy="description_input"
            v-model="internalDescription"
            :maxCharLimit="description_max_length"
            ref="editor"
            :readonly="published || translatable"
          >
          </glossary-editor>
        </div>
                <div
          class="row tag_category_selectors"
          v-if="is_event"
        >
          <div class="q-my-md q-mr-lg tag_list col">
            <span class="q-my-md label-edit">
              <help-label
                :fieldLabel="$t('input_labels.start_date') + ' *'"
                :helpLabel="$t('help.element_start_date')"
              ></help-label>
            </span>
            <date-time-selector
              :date="startDate"
              :time="startTime"
              @inputDate="startDate = $event"
              @inputTime="startTime = $event"
              :readonly="published || translatable"
              inline
            ></date-time-selector>
          </div>
          <div class="q-my-md tag_list col">
            <span class="q-my-md label-edit">
              <help-label
                :fieldLabel="$t('input_labels.finish_date') + ' *'"
                :helpLabel="$t('help.element_end_date')"
              ></help-label>
            </span>
            <date-time-selector
              :date="finishDate"
              :time="finishTime"
              @inputDate="finishDate = $event"
              @inputTime="finishTime = $event"
              :readonly="published || translatable"
              inline
            ></date-time-selector>
          </div>
        </div>
        <div class="row tag_category_selectors">
          <div
            v-if="categories_enabled"
            class="q-my-md tag_list col"
          >
            <span class="q-my-md label-edit">
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
              bg-color="grey-3"
              :label="internalCategories.length <= 0 ? this.$t('error_messages.no_categories') : ''"
              :readonly="published || translatable"
              clearable
            />
          </div>
          <div
            v-if="is_event"
            class="q-my-md q-ml-lg tag_list col"
          >
            <span class="q-my-md label-edit">
              <help-label
                :fieldLabel="$t('input_labels.location')"
                :helpLabel="$t('help.location')"
              ></help-label>
            </span>
            <div class="row">
              <q-input
                class="title_input col"
                data-cy="location_input"
                outlined
                v-model="location"
                bg-color="grey-3"
                :readonly="published || translatable"
              />
              <a
                :href="gmap_location(location)"
                target="_blank"
              >
                <q-icon
                  size="40px"
                  class="col q-mt-sm"
                  name="img:statics/icons/location.svg"
                />
                <q-tooltip>
                  {{$t('help.location_maps')}}
                </q-tooltip>
              </a>
            </div>
          </div>
        </div>
        <div class="row tag_category_selectors">
          <div
            v-if="topics_enabled"
            class="q-my-md tag_list col"
          >
            <span class="q-my-md label-edit">
              <help-label
                :fieldLabel="$t('input_labels.select_topic')"
                :helpLabel="$t('help.element_topic')"
              ></help-label>
            </span>
            <treeselect
              :multiple="true"
              :options="this.tree_options"
              :flat="true"
              :default-expand-level="1"
              placeholder="Try selecting some options."
              v-model="selectedTopics"
              @select="selectedTopics.push($event)"
              @deselect="selectedTopics = selectedTopics.filter(t => t !== $event)"
              @clear="selectedTopics = []"
            >
              <div
                slot="value-label"
                slot-scope="{ node }"
                :class="{unpublished: !node.raw.published}"
              >{{ node.label }}</div>
              <label
                slot="option-label"
                slot-scope="{node}"
                :class="{unpublished: !node.raw.published}"
              >
                {{ node.label }}
              </label>
            </treeselect>
          </div>
          <div
            v-if="user_types_enabled"
            class="q-my-md q-ml-lg tag_list col"
          >
            <span class="q-my-md label-edit">
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
              bg-color="grey-3"
              :readonly="published || translatable"
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
        <div
          class="row"
        >
          <div 
            class="col" 
            v-if="is_event"
          >
            <span class="label-edit">
              <help-label
                :fieldLabel="$t('input_labels.event_cost')"
                :helpLabel="$t('help.event_cost')"
              ></help-label>
            </span>
            <div class="row">
              <q-input
                class="q-mr-md col-6"
                outlined
                v-model="cost"
                bg-color="grey-3"
                counter
                :maxlength="50"
                :rules="[ val => val.length <= 50 || $t('error_messages.max_char_limit') + 50]"
                :readonly="published || costIsFree || translatable"
              />
              <div
                style="display: flex; align-items: center"
              >
                <q-checkbox
                  color="accent"
                  v-model="costIsFree"
                  :readonly="published || translatable"
                  :label="$t('input_labels.event_free')"
                />
              </div>
            </div>
          </div>
          <div class="col row">
            <div class="label-edit col-3" style="display: flex; align-items: center">
              <help-label
                :fieldLabel="$t('translation_states.translatable')"
                :helpLabel="$t('help.is_published')"
              ></help-label>
            </div>
            <q-toggle class="col" style="display: flex; align-items: center"
              v-model="translatable"
              color="accent"
            ></q-toggle>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading" class="q-mb-xl" style="text-align: center">
      <div style="display: inline-block">
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
          class="edit-element-button"
          :disable="published"
          :loading="saving"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HelpLabel from './HelpLabel'
import GlossaryEditor from './GlossaryEditor'
import DateTimeSelector from './DateTimeSelector'
import translatedButtonMixin from '../mixin/translatedButtonMixin'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'EditElement',
  components: {
    HelpLabel,
    GlossaryEditor,
    DateTimeSelector,
    Treeselect
  },
  mixins: [translatedButtonMixin],
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
      selectedTopics: [],
      internalUserTypesObjects: [],
      selectedUserType: '',
      selectedUserTypesObjects: [],
      elemId: -1,
      startDate: '',
      startTime: '',
      finishDate: '',
      finishTime: '',
      savedTranslations: [],
      translatable: false,
      originalTranslationState: 0,
      published: false,
      location: '',
      cost: null,
      costIsFree: true,
      saving: false
    }
  },
  methods: {
    ...mapActions('language', ['fetchActiveLanguages']),
    ...mapActions('topic', ['fetchTopic']),
    ...mapActions('user_type', ['fetchUserType']),
    gmap_location(location) {
      return "https://www.google.com/maps/search/?api=1&query=" + location
    },
    changeLanguageAux(al) {
      let idx = this.savedTranslations.findIndex((t) => (t.lang === al) && !t.translated)
      if (idx !== -1) {
        const element = this.savedTranslations[idx]
        this.setContent(element, al)
      } else {
        if (this.elem) {
          idx = this.elem.translations.findIndex((t) => (t.lang === al) && !t.translated)
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
      // this.errorDefaultLangEmpty = !this.internalTitle
      this.internalDescription = element.description ? element.description : ""
      // if (this.$refs.editor) {
      //   this.$refs.editor.setContent(this.internalDescription)
      // }
    },
    async saveContent() {
      const description = await this.$refs.editor.getContent()
      // translations[0] contains translated = false, translations[1] contains translated = true. User will edit [0] and weblate will work with [1]
      const translation0 = {
        title: this.internalTitle,
        description,
        translated: false,
        lang: this.$defaultLang,
        username: this.$store.state.auth.user.preferred_username,
        realm: "ngo"
      }
      this.savedTranslations[0] = translation0
      console.log(this.elem)
      console.log(this.originalTranslationState)
      if (!this.elem || (this.originalTranslationState === 1) || this.translatable) {
        const translation1 = {
          title: this.internalTitle,
          description,
          translated: true,
          lang: this.$defaultLang,
          username: this.$store.state.auth.user.preferred_username,
          realm: "ngo"
        }
        this.savedTranslations[1] = translation1
      }
      for (const savedTranslation of this.savedTranslations) {
        savedTranslation.translationState = this.translatable ? 1 : 0
        if (this.categories_enabled) {
          translation0.category = this.selectedCategoryObject
        }
        if (this.topics_enabled) {
          translation0.topics = this.selectedTopics
        }
        if (this.user_types_enabled) {
          translation0.userTypes = this.selectedUserTypesObjects.map(u => u.id)
        }
        if (this.is_event) {
          // Dates are expected to be UTC by the server
          if (this.startDate && this.startTime) {
            translation0.startDate = new Date(this.startDate + " " + this.startTime).toISOString()
          }
          if (this.finishDate && this.finishTime) {
            translation0.finishDate = new Date(this.finishDate + " " + this.finishTime).toISOString()
          }
          translation0.location = this.location
          if (!this.costIsFree) {
            translation0.cost = this.cost
          }
        }
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
        if (!ic.published) {
          this.internalCategoriesObjects.push(undefined)
          return undefined
        }
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
      this.internalCategories = this.internalCategories.filter((c) => c !== undefined)
      this.internalCategoriesObjects = this.internalCategoriesObjects.filter((c) => c !== undefined)
    },
    setInternalUserTypeSelector(al) {
      this.internalUserTypes = this.user.filter(ut => ut.published).map((ic) => {
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
    removeUserType(idx) {
      this.selectedUserTypesObjects.splice(
        idx, 1
      )
    },
    goBack() {
      this.$router.go(-1)
    },
    checkErrors() {
      return this.$refs.editor.hasError()
        || (this.internalTitle.length <= 0)
        || this.errorDateTimeEmpty
    },
    callSaveFn() {
      if (this.checkErrors()) {
        let errorMsg = ""
        if (this.errorDateTimeEmpty) {
          errorMsg = errorMsg.concat(this.$t("error_messages.date_time_empty"), "<br/>")
        }
        if (this.internalTitle.length <= 0) {
          errorMsg = errorMsg.concat(this.$t("error_messages.title_empty"), "<br/>")
        }
        if (this.$refs.editor.hasError()) {
          errorMsg = errorMsg.concat(this.$refs.editor.errorMessage)
        }
        this.$q.notify({
          type: 'warning',
          message: errorMsg,
          html: true
        })
      } else {
        this.saving = true
        this.saveContent().then(() => {
          this.save_item_fn(
            this.savedTranslations
          )
          this.saving = false
        })
      }
    }
  },
  computed: {
    ...mapGetters('language', ['activeLanguages']),
    ...mapGetters('topic', ['topic', 'tree_options']),
    ...mapGetters('user_type', ['user']),
    errorDateTimeEmpty: function () {
      return this.is_event
        && (
          this.startDate === ''
          || this.finishDate === ''
          || this.startTime === ''
          || this.finishTime === ''
        )
    },
    publishToggleState: function () {
      if (this.elem) {
        let idx = this.savedTranslations.findIndex((t) => t.lang === this.$defaultLang)
        let translation
        if (idx === -1) {
          idx = this.elem.translations.findIndex((t) => t.lang === this.$defaultLang)
          translation = this.elem.translations[idx]
        } else {
          translation = this.savedTranslations[idx]
        }
        return translation.translationState < 2
      } else {
        return true
      }
    }
  },
  created() {
    this.loading = true
    const al = this.$defaultLang
    this.fetchLanguages().then(() => {
      if (this.elem) {
        console.log(this.elem)
        this.changeLanguageAux(this.$defaultLang)
        this.published = this.elem.published
        this.elemId = this.elem.id
        const sTSIdx = this.elem.translations.findIndex((t) => (t.lang === al) && !t.translated)
        if (sTSIdx !== -1) {
          this.originalTranslationState = this.elem.translations[sTSIdx].translationState
          this.translatable = !!this.elem.translations[sTSIdx].translationState
        }
        if (this.categories_enabled && this.elem.category !== null) {
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
          console.log("here")
          // Expects ISO String, automatically converts to user's locale
          const startDate = new Date(this.elem.startDate)
          // Format used by QDate and QTime
          this.startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
          this.startTime = `${startDate.getHours().toLocaleString(this.$defaultLang, { minimumIntegerDigits: 2 })}:${startDate.getMinutes().toLocaleString(this.$defaultLang, { minimumIntegerDigits: 2 })}`
          const finishDate = new Date(this.elem.endDate)
          this.finishDate = `${finishDate.getFullYear()}-${finishDate.getMonth() + 1}-${finishDate.getDate()}`
          this.finishTime = `${finishDate.getHours().toLocaleString(this.$defaultLang, { minimumIntegerDigits: 2 })}:${finishDate.getMinutes().toLocaleString(this.$defaultLang, { minimumIntegerDigits: 2 })}`
          this.location = this.elem.location
          if (this.elem.cost) {
            this.cost = this.elem.cost
            this.costIsFree = false
          }
        }
      }
      if (this.categories.length > 0) {
        this.setInternalCategorySelector(al)
      }
      if (this.topics_enabled) {
        this.fetchTopic().then(() => {
          this.selectedTopics = this.topics
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
  font-weight: 400;
  font-family: "Nunito Sans";
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
  font-weight: 700;
  font-family: Nunito;
  font-size: 16px;
}

.top-div {
  font-weight: bold;
  font-size: 40px;
  line-height: 54px;
  color: #0f3a5d;
  padding: 35px 0;
}
.image {
  background-image: url("../statics/BG Pattern.svg");
}
</style>
<style>
.desc-editor .editor-options {
  width: 100%;
}
</style>