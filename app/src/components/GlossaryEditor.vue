<template>
  <div
    class="editor-component"
    padding
  >
    <span v-if="loading">Loading glossary...</span>
    <div
      class="editor"
      v-if="!loading"
    >
      <editor-menu-bar
        :editor="editor"
        v-slot="{ commands, isActive }"
      >
        <div>
          <!-- TODO: change button styles -->
          <q-btn
            :outline="isActive.bold()"
            :unelevated="!isActive.bold()"
            rounded
            label="Bold"
            @click="commands.bold"
          />
          <q-btn
            :outline="isActive.italic()"
            :unelevated="!isActive.italic()"
            rounded
            label="Italic"
            @click="commands.italic"
          />
          <q-btn
            :outline="isActive.strike()"
            :unelevated="!isActive.strike()"
            rounded
            label="Strike"
            @click="commands.strike"
          />
          <q-btn
            :outline="isActive.underline()"
            :unelevated="!isActive.underline()"
            rounded
            label="Underline"
            @click="commands.underline"
          />
          <q-btn
            :outline="isActive.paragraph()"
            :unelevated="!isActive.paragraph()"
            rounded
            label="Paragraph"
            @click="commands.paragraph"
          />
          <q-btn
            :outline="isActive.heading({ level: 1 })"
            :unelevated="!isActive.heading({ level: 1 })"
            rounded
            label="H1"
            @click="commands.heading({ level: 1 })"
          />
          <q-btn
            :outline="isActive.heading({ level: 2 })"
            :unelevated="!isActive.heading({ level: 2 })"
            rounded
            label="H2"
            @click="commands.heading({ level: 2 })"
          />
          <q-btn
            :outline="isActive.heading({ level: 3 })"
            :unelevated="!isActive.heading({ level: 3 })"
            rounded
            label="H3"
            @click="commands.heading({ level: 3 })"
          />
          <q-btn
            :outline="isActive.ordered_list()"
            :unelevated="!isActive.ordered_list()"
            rounded
            label="Ordered list"
            @click="commands.ordered_list"
          />
          <q-btn
            :outline="isActive.blockquote()"
            :unelevated="!isActive.blockquote()"
            rounded
            label="Blockquote"
            @click="commands.blockquote"
          />
          <q-btn
            unelevated
            rounded
            label="Horizontal rule"
            @click="commands.horizontal_rule"
          />
          <q-btn
            unelevated
            rounded
            label="Undo"
            @click="commands.undo"
          />
          <q-btn
            unelevated
            rounded
            label="Redo"
            @click="commands.redo"
          />
        </div>
      </editor-menu-bar>
      <editor-content
        class="editor__content"
        :editor="editor"
      />
    </div>
    <div
      class="suggestion-list"
      v-if="!loading && showSuggestions"
    >
      <template v-if="hasResults">
        <q-btn
          v-for="glossaryItem in filteredGlossaryItems"
          :key="glossaryItem.id"
          class="suggestion-list__item"
          unelevated
          :label="glossaryItem.title"
          @click="selectGlossaryItem(glossaryItem)"
        />
      </template>
      <div
        v-else
        class="suggestion-list__item is-empty"
      >
        No glossary items found
      </div>
    </div>
    <div v-if="!loading">
      <q-btn
        unelevated
        rounded
        no-caps
        label="Save"
        @click="emitEditorContent()"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Fuse from 'fuse.js'
import { Editor, EditorContent, EditorMenuBar } from "tiptap"
import {
  Blockquote,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Link,
  Strike,
  Underline,
  History,
  HardBreak,
  Heading,
  Bold,
  Italic,
  Mention
} from "tiptap-extensions"


export default {
  name: "GlossaryEditor",
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    content: {
      type: String | Object,
      default: ""
    }
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
    emitEditorContent() {
      this.$emit('editorSave', this.editor.getJSON())
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
      showSuggestionsData: false
    };
  },
  computed: {
    ...mapGetters('glossary', ['glossary']),
    hasResults() {
      return this.filteredGlossaryItems.length
    },
    showSuggestions() {
      return this.showSuggestionsData
    },
  },
  created() {
    this.loading = true
    this.fetchGlossary()
      .then(() => {
        this.editor = new Editor({
          extensions: [
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new Mention({
              items: () => this.glossary,
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
            }),
            new Bold(),
            new Italic(),
            new Blockquote(),
            new BulletList(),
            new HorizontalRule(),
            new ListItem(),
            new OrderedList(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Strike(),
            new Underline(),
            new History(),
          ],
          content: this.content
        }),
          this.loading = false
      })
  }
}
</script>
<style lang="scss">
.ProseMirror {
  border: 1px solid $primary;
}

.mention {
  border: 1px solid $primary;
}
</style>