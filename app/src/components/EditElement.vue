<template>
  <div padding>
    <span>Title:</span>
    <q-input
      color="accent"
      outlined
      label="Title"
      label-color="accent"
      v-model="internalTitle"
    />
    <span>Tags:</span>
    <div>
      <q-input
        color="accent"
        outlined
        placeholder="New tag"
        label-color="accent"
        v-model="tagInput"
      />
      <q-btn
        color="accent"
        no-caps
        @click="addTag()"
      >
        Add tag
      </q-btn>
      <span v-if="duplicateTagError">Duplicates are not allowed</span>
    </div>
    <div
      v-for="tag in internalTags"
      :key="tag"
    >
      <span>
        {{tag}}
      </span>
      <q-btn
        @click="internalTags.splice(internalTags.indexOf(tag), 1)"
        label="Delete"
        color="accent"
        no-caps
      />
    </div>
    <span>Description:</span>
    <glossary-editor
      class="desc-editor"
      :content="description"
      v-on:editorSave="save_item_fn(internalTitle, $event, internalTags)"
    />
  </div>
</template>

<script>
export default {
  name: "EditElement",
  props: {
    "title": {
      type: String,
      default: ""
    },
    "description": {
      type: String | Object,
      default: ""
    },
    "save_item_fn": {
      type: Function,
    },
    "tags": {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      internalTitle: this.title,
      internalTags: [...this.tags],
      tagInput: "",
      duplicateTagError: false,
    }
  },
  methods: {
    addTag() {
      if (this.internalTags.indexOf(this.tagInput) !== -1) {
        this.duplicateTagError = true
      } else {
        this.internalTags.push(this.tagInput)
        this.duplicateTagError = false
      }
    }
  },
  components: {
    "glossary-editor": require('components/GlossaryEditor.vue').default,
  },
}
</script>

<style lang="scss" scoped>
.desc-editor {
  border: 1px solid $primary;
  border-radius: 10px;
}
</style>