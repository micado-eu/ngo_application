<template>
  <div class="col-4 q-mx-md">
    <div class="row items-center justify-center">
      <div
        id="div-2"
        class="q-mr-md"
      >
        <q-btn
          :label="$t('button.batch_upload')"
          class="button"
          no-caps
          size="12px"
          @click="show_dialog=true"
        />
      </div>
      <div
        id="div-1"
      >
        <a
          :href="staticUrl"
        >{{$t('button.download_template')}}</a>
      </div>
    </div>
    <upload-button-dialog
      v-model="show_dialog"
      :entity="entity"
      :username="username"
      :realm="realm"
    >
    </upload-button-dialog>
  </div>
</template>

<script>
import UploadButtonDialog from './UploadButtonDialog'
import uploadButtons from '../mixin/uploadButtons.js'
export default {
  name: 'UploadButton',
  components: { UploadButtonDialog },
  mixins: [ uploadButtons ]
}
</script>
<style scoped>
.button {
  width: 150px;
  border: 1px solid #0b91ce;
  box-sizing: border-box;
  border-radius: 5px;
  background: #ffffff;
}
#div-1 {
  display: inline-block;
}
#div-2 {
  display: inline-block;
}
</style>
