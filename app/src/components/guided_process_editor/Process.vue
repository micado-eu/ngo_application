<template>
  <q-item class="width" clickable @click="selectGraph()" style="padding-top:0px; padding-bottom:0px">
        <div
          class=" q-pa-md col"
          style=" padding-bottom:0px; padding-left:0px"
        >
          <div style="font-size:20px; text-align:left; font-weight:600">{{ this.Title }}</div>

     
        <div class="row pad width">
          <div class="col-6">
            <q-img
                class="image"
                v-for="tag in Topics"
                :src="processTopics.filter(topic => topic.id == tag.idTopic)[0].icon"
                :key="'topic'.concat(tag.idTopic)">
              </q-img>
               <q-img
                class="image"
                v-for="tag in Users"
                :src="processUsers.filter(user => user.id == tag.idUserTypes)[0].icon"
                :key="'user'.concat(tag.idUserTypes)"
              >
              </q-img>  
          </div>
              <div
          class="q-pa-md q-gutter-sm  col-6"
          style="padding-top:0px; padding-bottom:5px; text-align:right"
        >
          <q-btn
            size="11px"
            no-caps
            :data-cy="'commentoprocess'.concat(Link)"
            style="width:70px:border-radius:2px"
            color="accent"
            label="Comment"
            :disable="hideAdd"
            @click.stop="hide();comment($event)"
          />
        </div>
            </div>
        
      
      <hr style="margin:0px; margin-top:10px">
    </div>
<q-dialog v-model="alert" full-width >
       <q-layout
        view="Lhh lpR fff"
        container
        class="bg-white"
      >
      <q-header
          
          class="bg-accent"
        >
          <q-toolbar>

            <q-toolbar-title> {{$t('input_labels.preview_migrant')}}</q-toolbar-title>
            <q-btn
              round
              dense
              flat
              v-close-popup
              color="white"
              icon="cancel"
            />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page class="q-pa-sm">
            <ProcessViewer
            :processid="process.id"
            :topics="processTopics"
            />
 
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </q-item>
 
</template>

<script>
import storeMappingMixin from '../../mixin/storeMappingMixin'
import editEntityMixin from '../../mixin/editEntityMixin'
import ProcessViewer from './ProcessViewer'

export default {
  name: 'Process',
  mixins:[editEntityMixin,
    storeMappingMixin({
    getters: {

    }, actions: {
      fetchGraph: 'flows/fetchGraph',
    }
  })
  ],
  props: ["Title", "Link", "Path", "process", "processTopics", "processUsers", "Topics", "Users", 'selectedProcess', 'mermaid'],
  data () {
    return {
      open:true,
      hideAdd: false,
      alert:false,
      merconf: { theme: "default", startOnLoad: false, securityLevel: 'loose', useMaxWidth: false, flowchart: { padding: 5 } },
    };
  },
  components:{
    ProcessViewer
  },
  methods: {
    editNodeMer(){
      console.log("clicked on node")
    },
    remove_process (event) {
      let target = event.currentTarget.id
      console.log(this.Link)
      this.$emit('remove', this.Link)

    },
    comment (event) {
      this.$emit('comment', this.process)
    },
    hide () {
      this.hideAdd = true;
    },
    restore () {
      this.hideAdd = false
    }, 
    selectGraph(){
     
      this.alert = true
    }
  }, 
  created() {
      
  }
}
</script>
<style scoped>
/*div >>> .q-item {
  border-radius: 2rem;

  &:hover {
    color: blue;
  }
}*/
.image{
  height: 25px; 
  max-width: 25px;
  margin-right:5px
}
.width{
  width: 100%;
}
</style>