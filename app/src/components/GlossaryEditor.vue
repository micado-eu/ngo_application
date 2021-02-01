<template>
  <div
    class="editor-component"
    padding
  >
    <div class="editor-options">
      <vue-countable
        :text="editor.getHTML()"
        :elementId="'myId'"
        @change="change"
        stripTags
      ></vue-countable> <!-- Counts words, has no visuals -->
      <span class="word-count">{{  $t("text_editor.word_count")  }}: {{ textCount.words }}</span>
      <div class="editor">
        <!-- Add link option when hovering text -->
        <editor-menu-bubble
          class="menububble"
          :editor="editor"
          keep-in-bounds
          @hide="hideLinkMenu"
          v-slot="{ commands, isActive, getMarkAttrs, menu }"
        >
          <div
            class="menububble"
            :class="{ 'is-active': menu.isActive }"
            :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
          >
            <form
              class="menububble__form"
              v-if="linkMenuIsActive"
              @submit.prevent="setLinkUrl(commands.link, linkUrl)"
            >
              <input
                class="menububble__input"
                type="text"
                v-model="linkUrl"
                placeholder="https://"
                ref="linkInput"
                @keydown.esc="hideLinkMenu"
              />
              <button
                class="menububble__button"
                @click="setLinkUrl(commands.link, null)"
                type="button"
              >
                X
              </button>
            </form>

            <template v-else>
              <button
                class="menububble__button"
                @click="showLinkMenu(getMarkAttrs('link'))"
                :class="{ 'is-active': isActive.link() }"
              >
                <span>{{ isActive.link() ? $t('button.update_link') : $t('button.add_link')}}</span>
              </button>
            </template>
          </div>
        </editor-menu-bubble>
        <editor-content
          class="editor_content"
          :editor="editor"
        />
        <editor-menu-bar
          :editor="editor"
          v-slot="{ commands, isActive }"
          class="row"
        >
          <div class="row">
            <q-btn
              :outline="isActive.bold()"
              :unelevated="!isActive.bold()"
              icon="img:statics/icons/MICADO PA APP Icon - Bold (600x600).png"
              @click="commands.bold"
              :disable="readonly"
            />
            <q-btn
              :outline="isActive.italic()"
              :unelevated="!isActive.italic()"
              icon="img:statics/icons/MICADO PA APP Icon - Italics (600x600).png"
              @click="commands.italic"
              :disable="readonly"
            />
            <q-btn
              unelevated
              icon="image"
              @click="showUploadModal = true"
              :disable="readonly"
            />
            <span style="flex: 10"></span>
            <slot style="flex: 3"></slot>
            <span
              class="error-message"
              v-if="errorMessage"
            >
              {{errorMessage}}
            </span>
            <!-- Image upload dialog -->
            <q-dialog
              v-model="showUploadModal"
              ref="uploadDialog"
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
                      <image-uploader
                        class="uploader"
                        @onUpload="onUploadImage($event, commands)"
                      ></image-uploader>
                      <q-input
                        :label="$t('upload_modal.text_alternative')"
                        color="accent"
                        style="width: 500px"
                        v-model="altImage"
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
                      <q-input
                        :label="$t('upload_modal.text_alternative')"
                        color="accent"
                        style="width: 500px"
                        v-model="altImage"
                      />
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn
                        unelevated
                        :label="$t('upload_modal.upload_button')"
                        @click="onUploadImage(urlImage, commands)"
                        color="accent"
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
import {
  Editor,
  EditorContent,
  EditorMenuBar,
  EditorMenuBubble
} from 'tiptap'
import {
  Link,
  History,
  Bold,
  Italic
} from 'tiptap-extensions'
import Image from 'components/editor_plugins/Image'
import GlossaryMention from 'components/editor_plugins/GlossaryMention'
import markdownConverterMixin from '../mixin/markdownConverterMixin'
import imageUpload from '../mixin/imageUpload'
import ImageUploader from './ImageUploader.vue'
import VueCountable from 'vue-countable'

export default {
  name: 'GlossaryEditor',
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    ImageUploader,
    VueCountable
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
      default: null
    }
  },
  mixins: [
    markdownConverterMixin,
    imageUpload
  ],
  data() {
    return {
      editor: null,
      editorChange: false,
      showUploadModal: false,
      uploadTab: 'upload',
      urlImage: '',
      errorMessage: "",
      linkUrl: null,
      linkMenuIsActive: false,
      textCount: {}, // value returned from VueCountable on text change
      altImage: null
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
    onUploadImage(event, commands) {
      commands.image({ src: event, alt: this.altImage})
      this.$refs.uploadDialog.hide()
      this.altImage = null
    },
    hasError() {
      return this.errorMessage.length > 0
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },
    change(event) {
      this.textCount = event
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
      if ((this.maxCharLimit !== null) && (this.textCount.characters > this.maxCharLimit)) {
        this.errorMessage = this.$t("error_messages.max_char_limit") + this.maxCharLimit
      } else {
        this.errorMessage = false
      }
    },
    readonly(val) {
      console.log("readonly: " + val)
      this.editor.setOptions({ editable: !val })
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
  border-radius: 4px;
}

.error-message {
  color: red;
}

.uploader {
  width: 100%;
}

.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: $dark;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: $grey-1;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba($grey-1, 0.1);
    }

    &.is-active {
      background-color: rgba($grey-1, 0.2);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: $grey-1;
  }
}

.word-count {
  font-family: "Nunito";
  font-weight: 600;
  font-size: 15px;
}
</style>

<style>
.editor-options {
  display: inline-block;
  width: 80%;
  vertical-align: top;
}

img {
  width: 100%;
  max-width: 300px;
}

.ProseMirror:focus {
  outline: none;
}
</style>
