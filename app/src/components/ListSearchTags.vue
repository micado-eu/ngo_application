<template>
  <div class="q-pa-md">
    <q-toolbar class="text-white shadow-2 row toolbar-list">
      <q-toolbar-title>{{ title }}</q-toolbar-title>
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
      :unelevated="selectedTags.indexOf(tag) == -1"
      :outline="selectedTags.indexOf(tag) !== -1"
      no-caps
      v-for="tag in tags"
      :key="tag"
      :label="tag"
      class="q-mr-sm tag_btn"
      @click="addOrRemoveSelectedTag(tag)"
    />
    <q-list class="q-mt-md">
      <q-item
        v-for="item in filteredElements"
        :key="item.id"
        clickable
        @mouseover="hovered = item.id"
        @mouseleave="hovered = -1"
      >
        <q-item-section class="title_section">
          <q-item-label :class="
              publishState[item.id]
                ? 'published title-label'
                : 'unpublished title-label'
            ">
            {{ item.title }}
          </q-item-label>
        </q-item-section>
        <q-item-section
          no-wrap
          class="description_section"
        >
          <glossary-editor-viewer
            :class="
              publishState[item.id]
                ? 'published'
                : 'unpublished'
            "
            :content="item.description"
            v-if="!loading"
            glossary_fetched
            :lang="lang"
          />
        </q-item-section>
        <q-item-section class="tag_btn_section">
          <q-btn
            no-caps
            v-for="tag in item.tags"
            :key="tag"
            :label="tag"
            class="q-mb-sm tag_btn"
          />
        </q-item-section>
        <q-item-section
          side
          :style="{ visibility: hovered === item.id ? 'visible' : 'hidden' }"
          class="icon_btn_section"
        >
          <q-btn
            round
            class="item-btn"
            icon="img:statics/icons/MICADO-Edit Icon - Black (600x600) transparent.png"
            :to="edit_url_fn(item.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Fuse from "fuse.js";
import GlossaryEditorViewer from "./GlossaryEditorViewer";
export default {
  name: "ListSearchTags",
  props: {
    elements: {
      type: Array,
      default: function () {
        return [];
      }
    },
    new_url: {
      type: String,
      default: "/"
    },
    edit_url_fn: {
      type: Function,
      default: function () {
        return () => "/";
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
      // display only elements in the language selected
      translatedElements: [],
      filteredElementsBySearch: [],
      filteredElementsByTags: [],
      searchText: "",
      tags: [],
      selectedTags: [],
      publishState: {},
      lang: "",
      loading: true
    };
  },
  components: {
    "glossary-editor-viewer": GlossaryEditorViewer
  },
  methods: {
    ...mapActions("glossary", ["fetchGlossary"]),
    addOrRemoveSelectedTag(tag) {
      var index = this.selectedTags.indexOf(tag);
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      } else {
        this.selectedTags.push(tag);
      }
      this.filterByTags();
    },
    filterByTags() {
      if (this.selectedTags.length > 0) {
        let selectedTags = this.selectedTags;
        this.filteredElementsByTags = this.elements.filter(e => {
          for (let tag of selectedTags) {
            if (e.tags.indexOf(tag) == -1) {
              return false;
            }
          }
          return true;
        });
      } else {
        this.filteredElementsByTags = this.elements;
      }
    }
  },
  computed: {
    search: {
      get() {
        return this.searchText;
      },
      set(newSearch) {
        if (newSearch) {
          const fuse = new Fuse(this.elements, {
            keys: ["title"]
          });
          this.filteredElementsBySearch = fuse
            .search(newSearch)
            .map(i => i.item);
          this.searchText = newSearch;
        } else {
          this.filteredElementsBySearch = this.elements;
          this.searchText = "";
        }
      }
    },
    filteredElements() {
      var filteredElementsByTags = this.filteredElementsByTags;
      return this.filteredElementsBySearch.filter(function (n) {
        return filteredElementsByTags.indexOf(n) !== -1;
      });
    }
  },
  created() {
    this.loading = true;
    this.lang = this.$i18n.locale
    this.fetchGlossary().then(() => {
      this.translatedElements = this.elements.map(e => {
        let al = this.$i18n.locale;
        let idx = e.translations.findIndex(t => t.lang === al);
        return e.translations[idx];
      });
      this.filteredElementsBySearch = this.translatedElements;
      this.filteredElementsByTags = this.translatedElements;
      for (let elem of this.elements) {
        // Tags
        if (elem.tags) {
          for (let tag of elem.tags) {
            if (this.tags.indexOf(tag) == -1) {
              this.tags.push(tag);
            }
          }
        }
        // Publish
        this.publishState[elem.id] = elem.published;
      }
      this.loading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
$accent_list: #ff7c44;
$btn_secondary: #cdd0d2;
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
  font-family: "Nunito";
  font-size: 15pt;
}
.item-btn {
  background-color: $btn_secondary;
}
.tag_btn {
  background-color: $btn_secondary;
  text-decoration: underline;
}
.published {
  opacity: 1;
}
.unpublished {
  opacity: 0.5;
}
.title_section {
  flex: 3000;
}
.description_section {
  flex: 10000;
}
.tag_btn_section {
  flex: 1000;
}
.icon_btn_section {
  flex: 350;
}
</style>