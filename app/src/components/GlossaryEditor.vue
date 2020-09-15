<template>
  <div
    class="editor-component"
    padding
  >
    <div class="editor-options">
      <span v-if="loading">Loading glossary...</span>
      <div
        class="editor"
        v-if="!loading"
      >
        <editor-content
          class="editor_content"
          :editor="editor"
        />
        <editor-menu-bar
          :editor="editor"
          v-slot="{ commands, isActive }"
          class="row"
        >
          <div>
            <q-btn
              :outline="isActive.bold()"
              :unelevated="!isActive.bold()"
              icon="img:statics/icons/MICADO PA APP Icon - Bold (600x600).png"
              @click="commands.bold"
            />
            <q-btn
              :outline="isActive.italic()"
              :unelevated="!isActive.italic()"
              icon="img:statics/icons/MICADO PA APP Icon - Italics (600x600).png"
              @click="commands.italic"
            />
            <q-btn
              :outline="isActive.underline()"
              :unelevated="!isActive.underline()"
              icon="img:statics/icons/MICADO PA APP Icon - Underline (600x600).png"
              @click="commands.underline"
            />
            <q-btn
              unelevated
              icon="image"
              @click="showUploadModal = true"
            />
            <!-- Image upload dialog -->
            <q-dialog
              v-model="showUploadModal"
              persistent
            >
              <q-card style="width: 500px">
                <q-toolbar class="bg-white">
                  <q-space />
                  <q-btn
                    color="red"
                    flat
                    v-close-popup
                    round
                    dense
                    icon="close"
                  />
                </q-toolbar>
                <q-tabs
                  v-model="uploadTab"
                  dense
                  class="text-accent"
                  active-color="accent"
                  indicator-color="accent"
                  align="justify"
                  narrow-indicator
                >
                  <q-tab
                    name="upload"
                    :label="$t('upload_modal.upload_label')"
                    class="accent"
                  />
                  <q-tab
                    name="url"
                    :label="$t('upload_modal.url')"
                    color="accent"
                  />
                </q-tabs>
                <q-tab-panels
                  v-model="uploadTab"
                  animated
                >
                  <q-tab-panel name="upload">
                    <q-card-section class="row items-center">
                      <!-- TODO: Upload -->
                      <q-uploader
                        :label="$t('upload_modal.upload_label')"
                        color="accent"
                        style="width: 500px"
                      />
                    </q-card-section>
                  </q-tab-panel>
                  <q-tab-panel name="url">
                    <q-card-section class="row items-center">
                      <q-input
                        :label="$t('upload_modal.url_label')"
                        color="accent"
                        style="width: 500px"
                        v-model="urlImage"
                      />
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn
                        unelevated
                        :label="$t('upload_modal.upload_button')"
                        @click="commands.image({src: urlImage})"
                        color="accent"
                        v-close-popup
                        no-caps
                      />
                    </q-card-actions>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-dialog>
          </div>
        </editor-menu-bar>
      </div>
    </div>
    <div
      class="suggestion-list q-ml-sm"
      v-if="!loading && showSuggestions"
    >
      <template v-if="hasResults">
        <div
          v-for="glossaryItem in filteredGlossaryItems"
          :key="glossaryItem.id"
        >
          <q-btn
            class="suggestion-list-item"
            color="grey-4"
            unelevated
            text-color="black"
            no-caps
            :label="glossaryItem.title"
            @click="selectGlossaryItem(glossaryItem)"
          />
        </div>
      </template>
      <div
        v-else
        class="suggestion-list-item is-empty"
      >
        No glossary items found
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Fuse from 'fuse.js'
import { Editor, EditorContent, EditorMenuBar } from "tiptap"
import {
  Link,
  Underline,
  History,
  Bold,
  Italic,
  Mention,
} from "tiptap-extensions"
import Image from "components/Image"

export default {
  name: "GlossaryEditor",
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String | Object,
      default: ""
    },
    lang: {
      type: String,
      default: "en"
    }
  },
  data() {
    return {
      editor: null,
      query: null,
      suggestionRange: null,
      filteredGlossaryItems: [],
      insertMention: () => { },
      loading: true,
      showSuggestionsData: false,
      internalLang: "",
      editorChange: false,
      showUploadModal: false,
      uploadTab: "upload",
      urlImage: "",
    };
  },
  methods: {
    ...mapActions("glossary", ["fetchGlossary"]),
    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectGlossaryItem(glossaryItem) {
      this.insertMention({
        range: this.suggestionRange,
        attrs: {
          id: glossaryItem.id,
          label: glossaryItem.title,
        },
      })
      this.editor.focus()
      this.showSuggestionsData = false
    },
    getContent() {
      return this.editor.getJSON();
    },
    setContent(content) {
      return this.editor.setContent(content)
    },
    getMentionElementsByLang(lang) {
      let mentionElements = []
      for (let glossaryElem of this.glossary) {
        let idx = glossaryElem.translations.findIndex(t => t.lang === lang)
        if (idx !== -1) {
          mentionElements.push(glossaryElem.translations[idx])
        }
      }
      return mentionElements
    },
    getMentionsByLang(lang) {
      let mentionElements = this.getMentionElementsByLang(lang)
      return new Mention({
        items: () => mentionElements,
        // is called when a suggestion starts
        onEnter: ({
          items, query, range, command, virtualNode,
        }) => {
          this.query = query
          this.filteredGlossaryItems = items
          this.suggestionRange = range
          this.showSuggestionsData = true
          this.insertMention = command
        },
        // is called when a suggestion has changed
        onChange: ({
          items, query, range, virtualNode,
        }) => {
          this.query = query
          this.filteredGlossaryItems = items
          this.suggestionRange = range
          this.showSuggestionsData = true
        },
        // is called when a suggestion is cancelled
        onExit: () => {
          // reset all saved values
          this.query = null
          this.filteredGlossaryItems = []
          this.suggestionRange = null
          this.showSuggestionsData = false
        },
        // we use fuse.js with support for fuzzy search
        onFilter: (items, query) => {
          if (!query) {
            return items
          }
          const fuse = new Fuse(items, {
            keys: ['title', 'description'],
          })
          return fuse.search(query).map(i => i.item)
        },
      })
    },
    createEditor() {
      if (this.editor) {
        this.editor.destroy()
      }
      this.editor = new Editor({
        extensions: [
          this.getMentionsByLang(this.internalLang),
          new Bold(),
          new Italic(),
          new Link(),
          new Underline(),
          new History(),
          new Image(null, null, this.uploadImage)
        ],
        onUpdate: ({ getHTML }) => {
          this.editorChange = true
          this.$emit("input", getHTML())
        },
        content: this.value
      })
    },
    setLang(lang) {
      // set mention list to the glossary terms in the language selected
      this.internalLang = lang
      this.createEditor()
    },
    uploadImage(file) {
      let formData = new FormData();
      formData.append('file', file);
      const headers = { 'Content-Type': 'multipart/form-data' };
      // TODO: implement when decision is made
    }
  },
  computed: {
    ...mapGetters('glossary', ['glossary']),
    hasResults() {
      return this.filteredGlossaryItems.length
    },
    showSuggestions() {
      return this.showSuggestionsData
    }
  },
  created() {
    this.loading = true
    this.internalLang = this.lang
    this.fetchGlossary()
      .then(() => {
        this.createEditor()
        this.loading = false
      })
  },
  watch: {
    value(val) {
      if (this.editor && !this.editorChange) {
        this.editor.setContent(val, false)
      }
      this.editorChange = false
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  }
}
</script>
<style lang="scss" scoped>
.mention {
  text-decoration: underline;
}

.editor_content {
  font-family: "Nunito Sans";
  font-size: 13pt;
  background-color: lightgray;
}

.editor-options {
  display: inline-block;
  width: 80%;
  vertical-align: top;
}

.suggestion-list {
  display: inline-block;
  vertical-align: top;
}

.suggestion-list-item {
  width: 100%;
}

.list-without-styles {
  list-style-type: none;
}
</style>