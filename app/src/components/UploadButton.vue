<template>
  <div class="col-4 justify-center">
    <div class="center">
          <div
            id="div-1"
            class="col-10"
            style="text-align:right"
          >
    <a style="padding-right:20px" :href="staticUrl">{{$t('button.download_template')}}</a>
          </div>
          <div
            id="div-2"
            class="col-2"
          >
    <q-btn
      :label="$t('button.batch_upload')"
      class="button"
      no-caps
      size="12px"
      @click="show_dialog=true"
    />
          </div>
    </div>
    <upload-button-dialog
      v-model="show_dialog"
      :entity="entity"
      :creator="creator"
    >
    </upload-button-dialog>
  </div>
</template>

<script>
import UploadButtonDialog from './UploadButtonDialog'
import markdownConverterMixin from '../mixin/uploadButtons.js'
export default {
  name: 'UploadButton',
  components: { UploadButtonDialog },
  mixins: [ markdownConverterMixin ]
}
</script>
<style scoped>
.button{
  width:150px; 
  margin-bottom:15px;
  border: 1px solid #0B91CE;
box-sizing: border-box;
border-radius: 5px;
 background: #FFFFFF;
 margin-top: 10px;
 }
 .center{
  text-align:center;
}
#div-1{
  display:inline-block;
  width:80%;
  padding-right:30px;
  padding-left:0px
}
#div-2{
  display:inline-block;
  text-align:right;
  width:150px
}
</style>
