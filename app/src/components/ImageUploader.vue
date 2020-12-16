<template>
  <!-- Max file size: 25 MB -->
  <q-file
    style="max-width: 300px"
    color="accent"
    filled
    use-chips
    v-model="file"
    :label="$t('upload_modal.uploader_label')"
    accept=".jpg, image/*"
    max-file-size="26214400"
    counter
    :clearable="!isUploading"
    @input="updateFile"
  >
    <template v-slot:file="{ index, file }">
      <q-chip
        class="full-width q-my-xs"
        :removable="isUploading && uploadProgress.percent < 1"
        square
        @remove="cancel()"
      >
        <q-linear-progress
          class="absolute-full full-height"
          :value="uploadProgress.percent"
          :color="uploadProgress.color"
          track-color="grey-2"
        />

        <q-avatar>
          <q-icon :name="uploadProgress.icon" />
        </q-avatar>

        <div class="ellipsis relative-position">
          {{ file.name }}
        </div>

        <q-tooltip>
          {{ file.name }}
        </q-tooltip>
      </q-chip>
    </template>

    <template
      v-slot:after
      v-if="canUpload"
    >
      <q-btn
        color="accent"
        dense
        icon="cloud_upload"
        round
        @click="upload"
        :disable="!canUpload"
        :loading="isUploading"
      />
    </template>
  </q-file>
</template>
<script>
import imageUpload from '../mixin/imageUpload'
export default {
  mixins: [imageUpload],
  data() {
    return {
      file: null,
      uploadProgress: null,
      uploading: null
    }
  },

  computed: {
    isUploading() {
      return this.uploading
    },

    canUpload() {
      return this.file !== null
    }
  },

  methods: {
    updateFile(file) {
      this.file = file
      this.uploadProgress = {
        error: false,
        color: 'green-2',
        percent: 0,
        icon: 'photo'
      }
    },
    upload() {
      // mixin imageUpload
      this.uploading = true
      let updateProgressFn = progressEvent => {
        const percent = progressEvent.loaded / progressEvent.total

        this.uploadProgress = {
          ...this.uploadProgress,
          error: false,
          color: 'green-2',
          percent
        }
      }
      return this.uploadImage(this.file, updateProgressFn)
        .then((imageUrl) => {
          this.uploadProgress = {
            ...this.uploadProgress,
            error: false,
            color: 'green-2',
            percent: 1
          }
          this.uploading = false
          console.log(imageUrl)
          this.$emit("onUpload", imageUrl)
        })
        .catch((err) => {
          if (this.isCancel(err)) {
            this.uploadProgress = {
              ...this.uploadProgress,
              error: true,
              color: 'orange-2'
            }
            this.$emit("onCancel", err)
          } else {
            this.uploadProgress = {
              ...this.uploadProgress,
              error: true,
              color: 'red-2'
            }
            this.$q.notify({
              type: 'negative',
              message: `File is not an image`
            })
            this.$emit("onError", err)
          }
        })
    }
  }
}
</script>