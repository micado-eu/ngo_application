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
              :disabled="readonly"
            />
            <q-btn
              :outline="isActive.italic()"
              :unelevated="!isActive.italic()"
              icon="img:statics/icons/MICADO PA APP Icon - Italics (600x600).png"
              @click="commands.italic"
              :disabled="readonly"
            />
            <q-btn
              unelevated
              icon="image"
              @click="showUploadModal = true"
              :disabled="readonly"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Link,
  History,
  Bold,
  Italic
} from 'tiptap-extensions'
import Image from 'components/editor_plugins/Image'
import GlossaryMention from 'components/editor_plugins/GlossaryMention'

export default {
  name: 'GlossaryEditor',
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String | Object, 
      default: ''
    },
    lang: {
      type: String,
      default: 'en'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      loading: true,
      internalLang: '',
      editorChange: false,
      showUploadModal: false,
      uploadTab: 'upload',
      urlImage: '',
      converter: undefined
    }
  },
  methods: {
    ...mapActions('glossary', ['fetchGlossary']),
    getJSON() {
      return this.editor.getJSON()
    },
    getHTML() {
      return this.editor.getHTML()
    },
    getContent() {
      console.log(this.getHTML())
      return this.getHTML()
    },
    setContent(content) {
      return this.editor.setContent(content)
    },
    createEditor() {
      if (this.editor) {
        this.editor.destroy()
      }
      this.editor = new Editor({
        extensions: [
          new Bold(),
          new Italic(),
          new Link(),
          new History(),
          new Image(null, null, this.uploadImage),
          new GlossaryMention()
        ],
        onUpdate: ({ getHTML }) => {
          this.editorChange = true
          this.$emit('input', getHTML())
        },
        editable: !this.readonly,
        content: this.value
      })
    },
    setLang(lang) {
      // set mention list to the glossary terms in the language selected
      this.internalLang = lang
      this.createEditor()
    },
    uploadImage(file) {
      const formData = new FormData()
      formData.append('file', file)
      const headers = { 'Content-Type': 'multipart/form-data' }
      // TODO: implement when decision is made
    }
  },
  computed: {
    ...mapGetters('glossary', ['glossary']),
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
