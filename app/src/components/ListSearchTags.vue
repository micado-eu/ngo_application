<template>
  <div class="q-pa-md">
    <q-input
      color="accent"
      v-model="search"
      debounce="500"
      filled
      outlined
      label="Search"
      label-color="accent"
      class="q-mb-md"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
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
    <q-toolbar class="bg-accent text-white shadow-2 q-mt-md">
      <q-avatar>
        <q-icon name="sort_by_alpha" />
      </q-avatar>
      <q-toolbar-title>{{title}}</q-toolbar-title>
      <q-btn
        flat
        round
        dense
        label="New"
        :to="new_url"
      />
    </q-toolbar>
    <q-list bordered>
      <q-item
        v-for="item in filteredElements"
        :key="item.id"
        clickable
        @mouseover="hovered=item.id"
        @mouseleave="hovered=-1"
      >
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>
        <q-item-section
          side
          v-for="tag in item.tags"
          :key="tag"
        >
          <q-btn
            unelevated
            color="accent"
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
            label="Edit"
            color="accent"
            :to="edit_url_fn(item.id)"
          />
        </q-item-section>
        <q-item-section
          side
          :style="{visibility: hovered===item.id ? 'visible' : 'hidden'}"
        >
          <q-btn
            label="Delete"
            color="accent"
            @click="delete_fn(item)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
export default {
  name: "ListSearchTags",
  props: ["elements", "new_url", "edit_url_fn", "delete_fn", "title"],
  data() {
    return {
      hovered: -1,
      filteredElementsBySearch: this.elements,
      filteredElementsByTags: this.elements,
      searchText: "",
      tags: [],
      selectedTags: []
    }
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
      if (elem.tags) {
        for (let tag of elem.tags) {
          if (this.tags.indexOf(tag) == -1) {
            this.tags.push(tag)
          }
        }
      }
    }
  }
}
</script>

<style>
</style>