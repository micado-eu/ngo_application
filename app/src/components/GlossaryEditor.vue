<template>
  <div
    class="editor-component"
    padding
  >
    <div class="editor-options">
      <div
        class="editor"
      >
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
            <span class="error-message" v-if="errorMessage">{{errorMessage}}</span>
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
        <editor-content
          class="editor_content"
          :editor="editor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Link,
  History,
  Bold,
  Italic
} from 'tiptap-extensions'
import Image from 'components/editor_plugins/Image'
import GlossaryMention from 'components/editor_plugins/GlossaryMention'
import markdownConverterMixin from '../mixin/markdownConverterMixin'

export default {
  name: 'GlossaryEditor',
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String, 
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isContentHTML: {
      type: Boolean,
      default: false
    },
    maxCharLimit: {
      type: Number,
      default: 800
    }
  },
  mixins: [markdownConverterMixin],
  data() {
    return {
      editor: null,
      editorChange: false,
      showUploadModal: false,
      uploadTab: 'upload',
      urlImage: '',
      errorMessage: ""
    }
  },
  methods: {
    getContent() {
      if (this.isContentHTML) {
        return this.getHTML()
      } else {
        return this.getMarkdown()
      }
    },
    getMarkdown() {
      return this.HTMLToMarkdown(this.editor.getHTML())
    },
    getHTML() {
      return this.editor.getHTML()
    },
    setContent(content, isHTML = false) {
      if (!isHTML) {
        this.editor.setContent(this.markdownToHTML(content))
      } else {
        this.editor.setContent(content)
      }
    },
    createEditor() {
      if (this.editor) {
        this.editor.destroy()
      }
      let currentContent = this.isContentHTML ? this.value : this.markdownToHTML(this.value)
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
        content: currentContent
      })
    },
    uploadImage(file) {
      const formData = new FormData()
      formData.append('file', file)
      const headers = { 'Content-Type': 'multipart/form-data' }
      // TODO: implement when decision is made
    },
    hasError() {
      return this.errorMessage.length > 0
    }
  },
  created() {
    this.createEditor()
  },
  watch: {
    value(val) {
      if (this.editor && !this.editorChange) {
        this.editor.setContent(val, false)
      }
      this.editorChange = false
      // check errors
      const doc = new DOMParser().parseFromString(this.editor.getHTML(), 'text/html')
      const plainDescription = doc.body.textContent || ''
      if (plainDescription.length > this.maxCharLimit) {
        this.errorMessage = this.$t("error_messages.max_char_limit") + this.maxCharLimit
      } else {
        this.errorMessage = false
      }
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
.editor_content {
  font-family: "Nunito Sans";
  font-size: 13pt;
  background-color: $grey-3;
  border: 1px solid $grey-5;
  border-radius: 4px
}

.error-message {
  color: red
}

</style>

<style>
.editor-options {
  display: inline-block;
  width: 80%;
  vertical-align: top;
}
</style>
