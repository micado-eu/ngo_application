<template>
  <div padding>
    <q-spinner v-if="loading" />
    <div v-else>
      <div>
        <editor-content
          class='editor_content'
          :editor="editor"
          ref="editor"
        />
      </div>
      <div>
        <slot name="append"></slot>
      </div>
      <div>
        <q-btn
          unelevated
          @click="showAllContent"
          v-if="readMore && !showingFullContent"
          rounded
          color="grey-5"
          size="sm"
          no-caps
          padding="1px 15px"
          class="q-mb-md"
        >
          {{ $t("button.read_more") }}
        </q-btn>
        <q-btn
          unelevated
          @click="showLessContent"
          v-if="readMore && showingFullContent"
          rounded
          size="sm"
          outline
          color="grey-8"
          no-caps
          padding="1px 15px"
          class="q-my-md"
        >
          {{ $t("button.read_less") }}
        </q-btn>
      </div>
    </div>
    <q-dialog v-model="showDialog">
      <internal-reference-dialog
        v-if="showDialog"
        :title="titleDialog"
        :link="linkDialog"
        @close="showDialog = false"
      >
        <glossary-editor-viewer
          :content="descriptionDialog"
          class="description"
          all_fetched
        />
      </internal-reference-dialog>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Editor, EditorContent } from 'tiptap'
import {
  Link,
  Bold,
  Italic
} from 'tiptap-extensions'
import Image from 'components/editor_plugins/Image.js'
import InternalMention from 'components/editor_plugins/InternalMention.js'
import markdownConverterMixin from '../mixin/markdownConverterMixin.js'
import InternalReferenceDialog from './InternalReferenceDialog.vue'

export default {
  name: 'GlossaryEditorViewer',
  components: {
    EditorContent,
    InternalReferenceDialog
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    all_fetched: {
      type: Boolean,
      default: false
    },
    isContentHTML: {
      type: Boolean,
      default: false
    },
    readMore: {
      type: Boolean,
      default: false
    }
  },
  mixins: [markdownConverterMixin],
  data() {
    return {
      loading: false,
      editor: null,
      showingFullContent: true,
      showDialog: false,
      referenceData: {},
      titleDialog: undefined,
      descriptionDialog: undefined,
      linkDialog: undefined
    }
  },
  computed: {
    ...mapGetters('glossary', ['glossaryTempElemById']),
    ...mapGetters('information', ['informationTempElemById']),
    ...mapGetters('flows', ['processTempById']),
    ...mapGetters('event', ['eventTempElemById']),
    currentDescription() {
      return this.currentDescriptionContent
    }
  },
  methods: {
    ...mapActions('glossary', ['fetchGlossaryTemp']),
    ...mapActions('information', ['fetchInformationTemp']),
    ...mapActions('flows', ['fetchFlowsTemp']),
    ...mapActions('event', ['fetchEventTemp']),
    async initialize() {
      this.editor = new Editor({
        editable: false,
        extensions: [
          new Bold(),
          new Italic(),
          new Link(),
          new Image(),
          new InternalMention({
            showInternalReference: this.showInternalReference
          })
        ],
        content: ''
      })
      await this.setContent(this.content)
      await this.$nextTick()
      this.cacheDialog()
      if (this.readMore) {
        let el = this.$refs.editor.$el
        let height = parseFloat(getComputedStyle(el, null).height.replace("px", ""))
        if (height >= 41) {
          el.classList.add('max-lines')
          this.showingFullContent = false
        }
      }
    },
    async setContent(content, isHTML = false) {
      let currentContent = content
      if (!isHTML) {
        currentContent = this.markdownToHTML(content)
      } else {
        currentContent = await this.markReferences(currentContent, this.$defaultLang, this.$userLang, true)
      }
      try {
        let newContent = currentContent
        this.allHTMLContent = currentContent
        this.editor.setContent(newContent)
        this.loading = false
        return newContent
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: `Error while fetching glossary description: ${err}`
        })
        this.loading = false
        return ''
      }
    },
    cacheDialog() {
      const elemByIdFunctions = {
        "g": this.glossaryTempElemById,
        "i": this.informationTempElemById,
        "e": this.eventTempElemById,
        "p": this.processTempById
      }
      this.mentions = this.$refs.editor.$el.querySelectorAll("[data-mention-id]")
      this.referenceData = {}
      for (let mention of this.mentions) {
        const idString = mention.getAttribute("data-mention-id")
        const id = parseInt(idString)
        const mentionType = mention.getAttribute("mention-type")
        const elem = this.getMentionData(id, mentionType, elemByIdFunctions)
        if (!(mentionType in this.referenceData)) {
          this.referenceData[mentionType] = {}
        }
        this.referenceData[mentionType][id] = elem
      }
    },
    showAllContent() {
      this.$refs.editor.$el.classList.remove('max-lines')
      this.showingFullContent = true
      this.$emit("readMorePressed")
    },
    showLessContent() {
      this.$refs.editor.$el.classList.add('max-lines')
      this.showingFullContent = false
      this.$emit("readLessPressed")
    },
    getMentionData(id, mentionType, elemByIdFunctions) {
      const mentionBaseURL = {
        "g": "glossary/{id}/edit",
        "i": "information/{id}/edit",
        "e": "events/{id}/edit",
        "p": "guided_process_editor/edit/{id}"
      }
      if (id > -1 && mentionType in elemByIdFunctions) {
        const elem = elemByIdFunctions[mentionType](id)
        if (elem !== undefined) {
          const url = "/" + mentionBaseURL[mentionType].replace("{id}", id)
          return {
            title: mentionType !== "p" ? elem.title : elem.process,
            description: elem.description,
            link: url
          }
        }
      }
    },
    showInternalReference(mentionType, id) {
      // Click event handler is managed by the InternalMention ProseMirror plugin
      this.titleDialog = this.referenceData[mentionType][id].title
      this.descriptionDialog = this.referenceData[mentionType][id].description
      this.linkDialog = this.referenceData[mentionType][id].link
      this.showDialog = true
    }
  },
  created() {
    this.loading = true
    if (!this.all_fetched) {
      const langs = { defaultLang: this.$defaultLang, userLang: this.$userLang }
      Promise.all([
        this.fetchGlossaryTemp(langs),
        this.fetchInformationTemp(langs),
        this.fetchFlowsTemp(langs),
        this.fetchEventTemp(langs)
      ])
        .then(() => this.initialize())
    } else {
      this.initialize()
    }
  }
}
</script>

<style lang="scss">
.mention {
  text-decoration: underline;
  color: #ff7c44;
  cursor: pointer;
}

img {
  width: 100%;
  max-width: 300px;
}

.description {
  font-family: Nunito Sans;
}

.max-lines {
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  white-space: nowrap;
  max-height: 41px;
  line-height: 21px;
}

.ProseMirror:focus {
  outline: none;
}

.desc_tooltip {
  max-width: 300px;
}
</style>