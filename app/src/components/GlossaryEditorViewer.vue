<template>
  <div padding>
    <editor-content
      class="editor_content ellipsis"
      :editor="editor"
    />
    <q-btn
      @click="showAllContent"
      v-if="!showingFullContent"
      rounded
      color="grey-5"
      no-caps
      padding="xs lg"
    >
      {{ $t("button.read_more") }}
    </q-btn>
    <q-tooltip
      class="desc_tooltip"
      v-model="showTooltip"
      :target="targetElement"
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
      v-if="currentDescription"
    >
      {{currentDescription}}
    </q-tooltip>
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
import Image from 'components/editor_plugins/Image'
import GlossaryMention from 'components/editor_plugins/GlossaryMention'
import markdownConverterMixin from '../mixin/markdownConverterMixin'
import * as htmlsave from 'htmlsave'

export default {
  name: 'GlossaryEditorViewer',
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    glossary_fetched: {
      type: Boolean,
      default: false
    },
    lang: {
      type: String,
      default: 'en'
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
      editor: null,
      currentDescriptionContent: '',
      targetElement: false,
      showTooltip: false, // Don't show by default
      fullHTMLContent: '',
      showingFullContent: !this.readMore
    }
  },
  computed: {
    ...mapGetters('glossary', ['glossary', 'glossaryElemById']),
    currentDescription() {
      return this.currentDescriptionContent
    }
  },
  methods: {
    ...mapActions('glossary', ['fetchGlossary']),
    initialize() {
      this.editor = new Editor({
        editable: false,
        extensions: [
          new Bold(),
          new Italic(),
          new Link(),
          new Image(),
          new GlossaryMention({
            showTooltip: true,
            glossaryElemByIdFunc: this.glossaryElemById,
            setTooltipDescription: this.setCurrentDescription,
            lang: this.lang
          })
        ],
        content: ''
      })
      this.setContent(this.content)
    },
    setContent(content, isHTML = false) {
      let currentContent = content
      if (!isHTML) {
        currentContent = this.markdownToHTML(content)
      }
      this.markGlossaryReferences(currentContent, this.lang, this.glossary_fetched).then((markedContent) => {
        let newContent = markedContent
        this.allHTMLContent = markedContent
        if (this.readMore) {
          newContent = htmlsave.truncate(markedContent, 300)
          if (markedContent===newContent) {
            this.showingFullContent = true
          }
        }
        this.editor.setContent(newContent)
      }).catch((err) => {
        console.error(err)
        this.$q.notify({
          type: 'negative',
          message: `Error while fetching glossary description: ${err}`
        })
      })
    },
    showAllContent() {
      this.editor.setContent(this.allHTMLContent)
      this.showingFullContent = true
    },
    setCurrentDescription(glossaryElem, element) {
      let currentContent = glossaryElem.description
      if (!this.isContentHTML) {
        currentContent = this.markdownToHTML(currentContent)
      }
      // Gets description and transforms it to plain text
      // Create an invisible editor to transform the JSON into HTML for parsing
      const editorInterpreter = new Editor({
        editable: false,
        extensions: [
          new Bold(),
          new Italic(),
          new Link(),
          new Image(),
          new GlossaryMention({
            showTooltip: true,
            glossaryElemByIdFunc: this.glossaryElemById,
            setTooltipDescription: this.setCurrentDescription,
            lang: this.lang
          })
        ],
        content: currentContent
      })
      const doc = new DOMParser().parseFromString(editorInterpreter.getHTML(), 'text/html')
      const plainDescription = doc.body.textContent || ''
      this.targetElement = element
      this.currentDescriptionContent = plainDescription
      editorInterpreter.destroy()
    }
  },
  created() {
    if (!this.glossary_fetched) {
      this.fetchGlossary().then(() => {
        this.initialize()
      })
    } else {
      this.initialize()
    }
  }
}
</script>

<style lang="scss">
.mention {
  text-decoration: underline;
}

img {
  width: 100%;
  max-width: 300px;
}

.editor_content {
  font-family: "Nunito Sans";
  font-size: 13pt;
}
</style>