<template>
  <div>
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{$t(pagetitle)}}</div>
    <span v-if="loading">Loading...</span>
    <div class = "edit-element-component q-pa-md q-ma-md" v-else>
      <span class="q-my-lg label-edit">{{$t('input_labels.title')}}:</span>
      <q-input
        class="title_input"
        outlined
        v-model="internalTitle"
      />
      <span class="q-my-lg label-edit">{{$t('input_labels.description')}}:</span>
      <glossary-editor
        class="desc-editor"
        v-model="internalDescription"
        :lang="$userLang"
        ref="editor"
      />
      <div class="row">
        <div
          v-if="tags_enabled"
          class="q-my-md tag_list col"
        >
          <span class="q-my-lg label-edit">{{$t('input_labels.tags')}}:</span>
          <div class="row">
            <q-input
              color="accent"
              outlined
              placeholder="New tag"
              label-color="accent"
              v-model="tagInput"
              class="col-8"
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
          <q-list
            v-if="internalTags.length > 0"
            separator
            bordered
            dense
          >
            <q-item
              v-for="tag in internalTags"
              :key="tag"
              class="q-mb-sm"
            >
              <q-item-section>
                <q-btn
                  class="tag_btn"
                  no-caps
                  :label="tag"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="internalTags.splice(internalTags.indexOf(tag), 1)"
                  round
                  icon="img:statics/icons/MICADO Delete Icon - Black (600x600) transparent.png"
                  no-caps
                  class="q-ml-sm del_tag_btn"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div
          v-if="categories_enabled"
          class="q-my-md q-ml-lg tag_list col"
        >
          <span class="q-my-lg label-edit">{{$t('input_labels.select_category')}}:</span>
          <q-select
            v-model="selectedCategory"
            :options="internalCategories"
            @input="setCategoryObjectModel($event)"
          />
        </div>
      </div>
      <hr style="width:85%;border: 0.999px solid #DADADA;margin-top:90px">
      <q-tabs
        v-model="langTab"
        @input="changeLanguage"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="language in languages"
          :key="language.lang"
          :name="language.lang"
          :label="language.name"
        />
      </q-tabs>
      <hr style="width:85%;border: 0.999px solid #DADADA">
      <div class="row q-mx-auto">
        <q-btn
          outline
          no-caps
          color="accent"
          :label="$t('button.cancel')"
          class="q-mr-sm edit-element-button"
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "EditElement",
  props: {
    pagetitle: {
      type: String,
      default: ""
    },
    elem: {
      type: Object
    },
    save_item_fn: {
      type: Function
    },
    tags: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tags_enabled: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: function () {
        return [];
      }
    },
    categories_enabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      internalTitle: "",
      internalDescription: "",
      internalTags: [],
      internalCategories: [],
      internalCategoriesObjects: [],
      selectedCategory: "",
      tagInput: "",
      tagError: false,
      tagErrorMessage: "",
      langTab: ""
    };
  },
  methods: {
    ...mapActions("language", ["fetchLanguages"]),
    changeLanguage(al) {
      if (this.elem) {
        let idx = this.elem.translations.findIndex(t => t.lang === al);
        if (idx !== -1) {
          this.internalTitle = this.elem.translations[idx].title;
          let parsedJson = this.elem.translations[idx].description;
          this.internalDescription = parsedJson;
          if (this.$refs.editor) {
            this.$refs.editor.setContent(parsedJson);
            this.$refs.editor.setLang(al);
          }
        } else {
          this.resetFields(al);
        }
      } else {
        this.resetFields(al);
      }
    },
    resetFields(al) {
      this.internalTitle = "";
      this.internalDescription = "";
      this.internalTags = [];
      this.selectedCategory = "";
      this.selectedCategoryObject = {};
      this.tagInput = "";
      this.setInternalCategorySelector(al);
      if (this.$refs.editor) {
        this.$refs.editor.setContent("");
        this.$refs.editor.setLang(al);
      }
    },
    addTag() {
      if (this.internalTags.indexOf(this.tagInput) !== -1) {
        this.tagErrorMessage = "Duplicates are not allowed.";
        this.tagError = true;
      } else if (this.tagInput.length <= 0) {
        this.tagErrorMessage = "Empty tags are not allowed.";
        this.tagError = true;
      } else {
        this.internalTags.push(this.tagInput);
        this.tagError = false;
        this.tagInput = "";
      }
    },
    setInternalCategorySelector(al) {
      this.internalCategories = this.categories.map(ic => {
        let idx = ic.translations.findIndex(t => t.lang === al);
        let translation = ic.translations[idx];
        this.internalCategoriesObjects.push(translation);
        let eventCategory = translation.eventCategory;
        if (eventCategory.length <= 0) {
          eventCategory = "&ltNot translated&gt";
        }
        return eventCategory;
      });
    },
    setCategoryObjectModel(eventCategory) {
      let idx = this.internalCategoriesObjects.findIndex(
        t => t.eventCategory === eventCategory
      );
      this.selectedCategoryObject = this.internalCategoriesObjects[idx];
      console.log(this.selectedCategoryObject);
    },
    goBack() {
      this.$router.go(-1);
    },
    callSaveFn() {
      this.save_item_fn(
        this.internalTitle,
        JSON.stringify(this.$refs.editor.getContent()),
        this.langTab,
        this.selectedCategoryObject,
        this.internalTags
      );
    }
  },
  computed: {
    ...mapGetters("language", ["languages"])
  },
  components: {
    "glossary-editor": require("components/GlossaryEditor.vue").default
  },
  created() {
    this.loading = true;
    let al = this.$i18n.locale;
    this.fetchLanguages().then(() => {
      this.langTab = this.languages.filter(function (l) {
        return l.lang == al;
      })[0].lang;
      if (this.elem) {
        this.changeLanguage(al);
        if (this.categories_enabled) {
          let idxCat = this.categories.findIndex(
            ic => ic.id === this.elem.category
          );
          let idxTranslation = this.categories[idxCat].translations.findIndex(
            t => t.lang === al
          );
          this.selectedCategoryObject = this.categories[idxCat].translations[
            idxTranslation
          ];
          this.selectedCategory = this.selectedCategoryObject.eventCategory;
        }
      }
      if (this.categories.length > 0) {
        this.setInternalCategorySelector(al);
      }
      if (this.tags.length > 0) {
        for (let tag of this.tags) {
          let idxTag = tag.translations.findIndex(t => t.lang === al);
          this.internalTags.push(tag.translations[idxTag].tag);
        }
      }
      this.loading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
$btn_secondary: #cdd0d2;
$title_font_size: 20pt;
.edit-element-component {
  border: 1px solid $btn_secondary;
  border-radius: 10px;
}
.edit-element-button {
  border-radius: 2px;
  width: 20%;
}

.label-edit {
  font-family: "Nunito";
  font-size: 15pt;
}
.tag_list {
  max-width: 45%;
}
.tag_btn {
  background-color: $btn_secondary;
  text-decoration: underline;
}
.del_tag_btn {
  background-color: $btn_secondary;
}
.title_input {
  font-size: $title_font_size;
}
.add_tag_btn {
  background-color: #0b91ce;
  color: white;
}
</style>
