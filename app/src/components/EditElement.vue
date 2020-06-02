<template>
  <div class="q-pa-md edit-element-component">
    <div class="page-title q-my-lg">{{pagetitle}}</div>
    <span class="q-my-lg label-edit">Title:</span>
    <q-input
      outlined
      label="Title"
      v-model="internalTitle"
    />
    <!-- TODO: Enable tags when mockup is available -->
    <!-- <span class="q-my-lg label-edit">Tags:</span>
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
    </div> -->
    <span class="q-my-lg label-edit">Description:</span>
    <glossary-editor
      class="desc-editor"
      :content="description"
      ref="editor"
    />
    <div class="row q-mx-auto">
      <q-btn
        outline
        no-caps
        color="accent"
        label="Cancel"
        class="q-mr-sm edit-element-button"
        @click="goBack()"
      />
      <q-btn
        unelevated
        no-caps
        color="accent"
        label="Save"
        @click="callSaveFn()"
        class="row edit-element-button"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "EditElement",
  props: {
    "pagetitle": {
      type: String,
      default: "",
    },
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
    },
    goBack() {
      this.$router.go(-1);
    },
    callSaveFn() {
      this.save_item_fn(this.internalTitle, this.$refs.editor.getContent(), this.internalTags)
    }
  },
  components: {
    "glossary-editor": require('components/GlossaryEditor.vue').default,
  }
}
</script>

<style lang="scss" scoped>
.edit-element-component {
  border: 1px solid $primary;
  border-radius: 10px;
}
.edit-element-button {
  border-radius: 2px;
  width: 20%;
}
.page-title {
  color: $primary;
  font-family: Nunito;
  font-size: 20pt;
  font-weight: bold;
}

.label-edit {
  font-family: Nunito;
  font-size: 15pt;
}
</style>