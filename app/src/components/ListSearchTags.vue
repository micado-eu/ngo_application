<template>
  <div class="q-pa-md">
    <q-toolbar class="text-white shadow-2 row toolbar-list">
      <q-toolbar-title>{{title}}</q-toolbar-title>
      <q-avatar>
        <q-icon
          :name="icon_name"
          size="lg"
        />
      </q-avatar>
    </q-toolbar>
    <div class="q-my-md row">
      <q-input
        color="accent"
        v-model="search"
        debounce="500"
        filled
        outlined
        label="Search"
        class="col-10"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        outlined
        no-caps
        :label="add_label"
        class="add-btn col q-ml-md"
        :to="new_url"
      />
    </div>
    <q-btn
      unelevated
      no-caps
      :color="selectedTags.indexOf(tag) == -1 ? 'accent' : 'primary'"
      v-for="tag in tags"
      :key="tag"
      :label="tag"
      class="q-mr-sm"
      @click="addOrRemoveSelectedTag(tag)"
    />
    <q-list class="q-mt-md">
      <q-item
        v-for="item in filteredElements"
        :key="item.id"
        clickable
        :class="publishState[item.id] ? 'published' : 'unpublished'"
        @mouseover="hovered=item.id"
        @mouseleave="hovered=-1"
      >
        <q-item-section>
          <q-item-label class="title-label">{{ item.title }}</q-item-label>
        </q-item-section>
        <q-item-section
          no-wrap
          top
        >
          <glossary-editor-viewer :content="item.description" />
        </q-item-section>
        <q-item-section
          side
          v-for="tag in item.tags"
          :key="tag"
        >
          <q-btn
            no-caps
            :key="tag"
            :label="tag"
          />
        </q-item-section>
        <q-item-section
          side
          :style="{visibility: hovered===item.id ? 'visible' : 'hidden'}"
        >
          <q-btn
            round
            class="item-btn"
            icon="img:statics/icons/MICADO PA APP Icon - Edit (600x600).png"
            :to="edit_url_fn(item.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import GlossaryEditorViewer from './GlossaryEditorViewer'
export default {
  name: "ListSearchTags",
  props: {
    elements: {
      type: Array,
      default: function () {
        return []
      }
    },
    new_url: {
      type: String,
      default: "/"
    },
    edit_url_fn: {
      type: Function,
      default: function () {
        return () => "/"
      }
    },
    title: {
      type: String,
      default: ""
    },
    icon_name: {
      type: String,
      default: ""
    },
    add_label: {
      type: String,
      default: "Add"
    },
  },
  data() {
    return {
      hovered: -1,
      filteredElementsBySearch: this.elements,
      filteredElementsByTags: this.elements,
      searchText: "",
      tags: [],
      selectedTags: [],
      publishState: {}
    }
  },
  components: {
    "glossary-editor-viewer": GlossaryEditorViewer
  },
  methods: {
    addOrRemoveSelectedTag(tag) {
      var index = this.selectedTags.indexOf(tag)
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      } else {
        this.selectedTags.push(tag)
      }
      this.filterByTags()
    },
    filterByTags() {
      if (this.selectedTags.length > 0) {
        let selectedTags = this.selectedTags;
        this.filteredElementsByTags = this.elements.filter(e => {
          for (let tag of selectedTags) {
            if (e.tags.indexOf(tag) == -1) {
              return false
            }
          }
          return true;
        });
      } else {
        this.filteredElementsByTags = this.elements
      }
    }
  },
  computed: {
    search: {
      get() {
        return this.searchText
      },
      set(newSearch) {
        if (newSearch) {
          const fuse = new Fuse(this.elements, {
            keys: ['title'],
          })
          this.filteredElementsBySearch = fuse.search(newSearch).map(i => i.item)
          this.searchText = newSearch
        } else {
          this.filteredElementsBySearch = this.elements
          this.searchText = ""
        }
      }
    },
    filteredElements() {
      var filteredElementsByTags = this.filteredElementsByTags
      return this.filteredElementsBySearch.filter(function (n) {
        return filteredElementsByTags.indexOf(n) !== -1;
      });
    }
  },
  created() {
    for (let elem of this.elements) {
      // Tags
      if (elem.tags) {
        for (let tag of elem.tags) {
          if (this.tags.indexOf(tag) == -1) {
            this.tags.push(tag)
          }
        }
      }
      // Publish
      this.publishState[elem.id] = elem.publish
    }
  }
}
</script>

<style lang="scss" scoped>
$accent_list: #ff7c44;
.add-btn {
  color: $accent_list;
  border: 1px solid $accent_list;
  border-radius: 2px;
}
.toolbar-list {
  background-color: $accent_list;
  border-radius: 2px;
}
.title-label {
  font-weight: bold;
  font-family: Nunito;
  font-size: 15pt;
}
.item-btn {
  background-color: $accent_list;
}
.published {
  opacity: 1;
}
.unpublished {
  opacity: 0.5;
}
</style>