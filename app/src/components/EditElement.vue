<template>
  <div class="q-pa-md edit-element-component">
    <div class="page-title q-my-lg">{{pagetitle}}</div>
    <span class="q-my-lg label-edit">Title:</span>
    <q-input
      class="title_input"
      outlined
      v-model="internalTitle"
    />
    <span class="q-my-lg label-edit">Description:</span>
    <glossary-editor
      class="desc-editor"
      :content="description"
      ref="editor"
    />
    <div
      v-if="tags_enabled"
      class="q-my-md tag_list"
    >
      <span class="q-my-lg label-edit">Tags:</span>
      <q-list
        v-if="internalTags.length > 0"
        separator
        bordered
        dense
      >
        <q-item
          v-for="tag in internalTags"
          :key="tag"
          class="q-mb-sm"
        >
          <q-item-section>
            <q-btn
              class="tag_btn"
              no-caps
              :label="tag"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click="internalTags.splice(internalTags.indexOf(tag), 1)"
              round
              icon="img:statics/icons/MICADO PA APP Icon - Delete (600x600).png"
              no-caps
              class="q-ml-sm del_tag_btn"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div>
        <q-input
          color="accent"
          outlined
          placeholder="New tag"
          label-color="accent"
          v-model="tagInput"
        />
        <q-btn
          no-caps
          @click="addTag()"
          label="Add tag"
          class="q-my-sm add_tag_btn"
        />
        <span
          v-if="tagError"
          class="q-ml-sm"
        >
          {{tagErrorMessage}}
        </span>
      </div>
    </div>
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
    },
    "tags_enabled": {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      internalTitle: this.title,
      internalTags: [...this.tags],
      tagInput: "",
      tagError: false,
      tagErrorMessage: "",
    }
  },
  methods: {
    addTag() {
      if (this.internalTags.indexOf(this.tagInput) !== -1) {
        this.tagErrorMessage = "Duplicates are not allowed."
        this.tagError = true
      } else if (this.tagInput.length <= 0) {
        this.tagErrorMessage = "Empty tags are not allowed."
        this.tagError = true
      } else {
        this.internalTags.push(this.tagInput)
        this.tagError = false
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
$btn_secondary: #cdd0d2;
$title_font_size: 20pt;
.edit-element-component {
  border: 1px solid $primary;
  border-radius: 10px;
}
.edit-element-button {
  border-radius: 2px;
  width: 20%;
}
.page-title {
  color: #0f3a5d;
  font-family: Nunito;
  font-size: $title_font_size;
  font-weight: bold;
}

.label-edit {
  font-family: Nunito;
  font-size: 15pt;
}
.tag_list {
  max-width: 20%;
}
.tag_btn {
  background-color: $btn_secondary;
  text-decoration: underline;
}
.del_tag_btn {
  background-color: $btn_secondary;
}
.title_input {
  font-size: $title_font_size;
}
.add_tag_btn {
  background-color: $btn_secondary;
}
</style>