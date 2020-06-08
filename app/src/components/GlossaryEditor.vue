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
    getContent() {
      return this.editor.getJSON();
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
            new Link(),
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