<template>
<div v-if="loading"> {{$t('input_labels.loading')}} </div>
<div v-else>
  <div class="q-pa-md">
        <glossary-editor-viewer
          :content="privacy"
          :key="privacy"
        />
  </div>     
</div>
</template>

<script>
import GlossaryEditorViewer from 'components/GlossaryEditorViewer'
import storeMappingMixin from "../mixin/storeMappingMixin"

export default {
  //name: 'Error404'
  mixins: [
    storeMappingMixin({
      getters: {
        mixed_settings:"settings/mixed_settings_mig"
      },
      actions: {
        fetchMixedSettings: "settings/fetchMixedSettingsMigrant"
      }
    })
  ],
  computed:{
    privacy(){
      var info = this.mixed_settings.filter((set) => set.key == 'policy_cso')
      if(info.length >0){
        console.log(info)
        return info[0].value
      }
      else{
        return ''
      }
    }
  },
  components:{
    GlossaryEditorViewer
  },
  data() {
    return{
      loading:true
    }
  },
  created(){
    this.fetchMixedSettings({
        defaultLang: this.$defaultLang,
        userLang: this.$userLang
        }).then((ret)=>{
      console.log(this.$defaultLang)
      console.log(this.$userLang)
      console.log(ret)
      this.loading = false
    })
  }
}
</script>
