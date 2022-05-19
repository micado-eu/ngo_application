<template>
  <div class="col-4 justify-center">
    <q-dialog
      :value="value" 
      @input="$emit('input')"
      persistent
      style="width: 750px"
    >
      <q-card>
        <q-card-section class="row items-center">
          <q-file
            v-model="files"
            :label="$t('input_labels.upload_file')"
            accept=".csv"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('button.cancel')"
            color="active"
            v-close-popup
          />
          <q-btn
            flat
            :label="$t('button.upload')"
            :disable="files == null"
            color="alert"
            @click="uploadFile()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import FormData from 'form-data'
export default {
  data() {
    return {
      files: null
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    entity: {
      type: String,
      default: '',
      validator: function (value) {
        // The value must match one of these strings
        return [
          'glossary',
          'intervention_category',
          'event',
          'process',
          'information',
          'information_category',
          'event_category'
        ].indexOf(value) !== -1
      }
    },
    username: {
      // Id of the creator of the entity
      type: String,
      default: null
    },
    realm: {
      // Realm of the creator of the entity
      type: String,
      default: null
    }
  },
  methods: {
    uploadFile: function () {
      let formData = new FormData()
      formData.append('files', this.files)
      formData.append('entity', this.entity)
      if (this.username !== null) {
        formData.append('username', this.username)
        formData.append('realm', this.realm)
      }
      console.log(formData)
      console.log(this.$axios.defaults.headers)
      let postHeaders = this.$axios.defaults.headers
      postHeaders['Content-Type'] = 'multipart/form-data'


      //      console.log(formData.getHeaders())
      const self = this
      this.$axios.post('/files',
        formData,
        {
          headers: postHeaders
        }
      ).then(function () {
        console.log('SUCCESS!!')
        self.$emit("uploadSuccess", true)
      }).catch(function (err) {
        console.log('FAILURE!!')
        self.$emit("uploadError", err)
      })

    }
  }
}
</script>

<style>
</style>