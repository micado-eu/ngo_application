<template>
<div class="comments">
     <p class="header"> {{ $t('input_labels.comments') }} </p>
      <div
      style="padding-top:10px"
      v-for="comment in selected_process_comments"
      :key="comment.id"
      >
      {{comment.translations.filter(filterTranslationModel(activeLanguage))[0].comment}}<br>
      - {{comment.tenant.name}}
      
      </div>
    </div>
</template>

<script>
import editEntityMixin from '../mixin/editEntityMixin'


export default {
  // name: 'ComponentName',
  props: ['selected_process_comments'],
  mixins:[editEntityMixin],
  
  data () {
    return {}
  },
  computed: {
    
  }
}
</script>
<style scoped>
.comments{
  margin-top:5px;
}
.header{
  margin-bottom:10px;
  font-weight: 600;
  font-size: 16px;
}
</style>