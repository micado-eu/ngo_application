<template>
  <div
    padding
    :id="uuid"
  >
    <editor-content
      class="editor_content"
      :editor="editor"
    />
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

let uuid = 0

export default {
  name: 'GlossaryEditorViewer',
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String | Object,
      default: ''
    },
    glossary_fetched: {
      type: Boolean,
      default: false
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      editor: null,
      currentDescriptionContent: '',
      targetElement: false,
      showTooltip: false // Don't show by default
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
            setTooltipDescription: this.currentDescriptionSetter,
            lang: this.lang
          })
        ],
        content: ''
      })
      this.setContent(this.content)
    },
    setContent(content) {
      this.editor.setContent(content)
    },
    getMentionElementsByLang() {
      const mentionElements = []
      for (const glossaryElem of this.glossary) {
        const idx = glossaryElem.translations.findIndex((t) => t.lang === this.lang)
        if (idx !== -1) {
          mentionElements.push(glossaryElem.translations[idx])
        }
      }
      return mentionElements
    },
    setCurrentDescription(glossaryElem, element) {
      // Gets JSON description and transforms it to plain text
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
            setTooltipDescription: this.currentDescriptionSetter,
            lang: this.lang
          })
        ],
        content: glossaryElem.description
      })
      const doc = new DOMParser().parseFromString(editorInterpreter.getHTML(), 'text/html')
      const plainDescription = doc.body.textContent || ''
      this.targetElement = element
      this.currentDescriptionContent = plainDescription
      editorInterpreter.destroy()
    }
  },
  beforeCreate() {
    this.uuid = uuid.toString()
    uuid += 1
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

<style lang="scss" scoped>
.mention {
  text-decoration: underline;
}
.editor_content {
  font-family: "Nunito Sans";
  font-size: 13pt;
}
</style>
