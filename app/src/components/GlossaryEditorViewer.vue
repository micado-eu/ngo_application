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
    >
      {{currentDescription}}
    </q-tooltip>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { Editor, EditorContent } from "tiptap"
import {
  Link,
  Underline,
  Bold,
  Italic,
  Mention
} from "tiptap-extensions"

let uuid = 0

export default {
  name: "GlossaryEditorViewer",
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String | Object,
      default: ""
    }
  },
  data() {
    return {
      editor: null,
      currentDescriptionContent: "",
      targetElement: false,
      showTooltip: false, // Don't show by default
    }
  },
  computed: {
    ...mapGetters('glossary', ['glossary', 'glossaryElemById']),
    currentDescription() {
      return this.currentDescriptionContent
    }
  },
  methods: {
    ...mapActions("glossary", ["fetchGlossary"]),
    setContent(content) {
      this.editor.setContent(content)
    },
    setCurrentDescription(glossaryElem, element) {
      // Gets JSON description and transforms it to plain text
      // Create an invisible editor to transform the JSON into HTML for parsing
      var editorInterpreter = new Editor({
        editable: false,
        extensions: [
          new Mention({
            items: () => this.glossary,
          }),
          new Bold(),
          new Italic(),
          new Underline(),
        ],
        content: glossaryElem.description
      })
      var doc = new DOMParser().parseFromString(editorInterpreter.getHTML(), 'text/html');
      var plainDescription = doc.body.textContent || "";
      this.targetElement = element
      this.currentDescriptionContent = plainDescription
      editorInterpreter.destroy()
    },
    setGlossaryClickEvents() {
      var glossaryElemByIdFunc = this.glossaryElemById
      var currentDescriptionSetter = this.setCurrentDescription
      var uuid = this.uuid
      document.addEventListener("mouseover", function (e) {
        var componentDiv = document.getElementById(uuid)
        var isParentOfDiv;
        if (componentDiv) {
          isParentOfDiv = componentDiv.contains(e.target)
        } else {
          isParentOfDiv = false
        }
        var isParentOfDiv = componentDiv !== null ? componentDiv.contains(e.target) : false
        if (e.target && e.target.classList.contains("mention") && isParentOfDiv) {
          var id = e.srcElement.getAttribute("data-mention-id")
          var glossaryElem = glossaryElemByIdFunc(id)
          currentDescriptionSetter(glossaryElem, e.target)
        }
      })
    }
  },
  beforeCreate() {
    this.uuid = uuid.toString();
    uuid += 1;
  },
  created() {
    this.fetchGlossary().then(() => {
      this.editor = new Editor({
        editable: false,
        extensions: [
          new Mention({
            items: () => this.glossary,
          }),
          new Bold(),
          new Italic(),
          new Link(),
          new Underline(),
        ],
        content: ""
      })
      this.setContent(this.content)
      this.setGlossaryClickEvents()
    })
  }
}
</script>

<style lang="scss">
.mention {
  text-decoration: underline;
}
.editor_content {
  font-family: Nunito Sans;
  font-size: 13pt;
}
</style>