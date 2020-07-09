  <template>
  <div class="container" >
    <q-card>
    <q-card-section :hidden="hideForm">
         <q-tabs
          v-model="langTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="language in languages"
            :key="language.lang"
            :name="language.name"
            :label="language.name"
          />
        </q-tabs>
        <q-tab-panels
          v-model="langTab"
          animated
        >
          <q-tab-panel
            v-for="language in languages"
            :key="language.lang"
            :name="language.name"
          >
        <q-input
          v-model="int_comment_shell.translations.filter(filterTranslationModel(language.lang))[0].comment"
          filled
          type="textarea"
          label="Comment"
        />
        </q-tab-panel>
        </q-tab-panels>
        <q-btn color="accent" unelevated rounded style="width:70px;border-radius:2px" label="Save" @click="saveComment(int_comment_shell)" />
        <q-btn class="button" unelevated rounded style="width:70px;border-radius:2px" label="Cancel" @click="cancelComment()" />
    </q-card-section>
    </q-card>
  <div style="text-align:center;padding-top:10px">
   <div class="col" style="display:inline-block;padding-right:20px;padding-left:20px">
   <q-input style="border-radius:10px; width:590px;font-size:18px" dense items-center filled v-model="search" label="Search" >
   <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
        </template>
    </q-input>
  </div>
  <div class="col" style="display:inline-block;text-align:right;width:135px">
   <q-btn style="width:135px; margin-bottom:15px" color="accent" rounded label="Add Process" no-caps size="15px" to="guided_process_editor/edit" />
  </div>
  </div>
  
  <div style="text-align:center;">
    <q-list style="display:inline-block;width:750px" >
        <Process v-for="process in filteredProcesses"
         ref="process"
         :process="process"
         :key="process.id"
         :Title="process.title"
         :Tag_1="process.user_tags"
         :Tag_2="process.topic_tags"
         :Link="process.id"
         Path="guided_process_editor"
         @remove="deleteProcess"
         @comment="editComment">
        </Process>
    </q-list>
    </div>
  </div>
</template>


<script>
import Process from './guided_process_editor/Process'
import editEntityMixin from '../mixin/editEntityMixin'



export default {
  name: 'DocumentType',
  props: {
    msg: String
  },
    mixins: [editEntityMixin],
  components: {
   Process
  },
  data () {
    return {
      is_new : true,
      search: ' ',
      hideForm: true,
      int_comment_shell : {id:-1, idProcess: -1, translations:[]}
    }
  },

  computed: {
     processes () {
      return this.$store.state.flows.flows
    }, 
    filteredProcesses () {
        //if none of the fields is filled in it will give the full list of processes
        if( this.search == "") {
          return this.processes
        }
        else {
          return this.processes.filter((filt) =>{
          //Splits the search field and puts the words in an array
          var searchArray = this.search.split(" ")
          if( searchArray.every(string => filt.title.toLowerCase().includes(string))){
              return true;
            }})
        } 
    }, 
    comments(){
      return this.$store.state.comments.comments
    }
  },
  methods: {
     deleteProcess(value) {
      var deletedProcess = this.processes.filter((filt) => {
          console.log("in fil")
          console.log(filt)
          return filt.id == value
        })  
      this.$store.commit('flows/deleteProcess', deletedProcess[0])
    },
    saveComment(int_comment_shell){
    if(this.is_new){
    this.$store.commit('comments/saveComments', this.int_comment_shell)
    this.hideForm = true
    this.createShell()
    for(var i = 0; i< this.$refs.process.length; i++){
        this.$refs.process[i].restore()
      }
    }
    else{
      this.$store.commit('comments/editComments', this.int_comment_shell)
      console.log("EDITED")
      console.log(this.$store.comments)
      this.hideForm = true
      for(var i = 0; i< this.$refs.process.length; i++){
        this.$refs.process[i].restore()
      }
      this.createShell()
    }
    },
    cancelComment(){
      this.createShell()
      this.hideForm = true
      for(var i = 0; i< this.$refs.process.length; i++){
        this.$refs.process[i].restore()
      }
    },
    editComment(value){
      var the_comment =  this.comments.filter((a_comment) => {
       return a_comment.idProcess == value.id
     })[0]
     console.log("I AM THE CIMMMENT")
     console.log(the_comment)
     if(the_comment == null){
       console.log("inside if")
       this.is_new = true
       this.createShell()
       this.int_comment_shell.idProcess = value.id
       this.hideForm= false
     }
     else{
              console.log("inside else")

    this.is_new = false
     this.mergeProcess(the_comment)
     console.log(the_comment)
      console.log(value)
      for(var i = 0; i< this.$refs.process.length; i++){
        this.$refs.process[i].hide()
      }
      console.log(this.$refs.process)
      //this.$refs.process.restore()
       this.hideForm = false
     }
    },

createShell () {
      this.int_comment_shell = { id: -1, idProcess : -1, translations:[] }
      this.languages.forEach(l => {
        this.int_comment_shell.translations.push({ id: -1, lang: l.lang, comment: '', translationDate: null })
      });
    },
    mergeProcess (comment) {
      console.log("MERGING")
      console.log(process)
      this.int_comment_shell.id = comment.id
      this.int_comment_shell.idProcess = comment.idProcess
      
      //this.edit_process.applicableUsers = process.applicableUsers
      //    this.edit_process.processTopics = process.processTopics
      comment.translations.forEach(pr => {
        console.log(pr)
        //    this.int_topic_shell.translations.filter(function(sh){return sh.lang == tr.lang})

        for (var i = 0; i < this.int_comment_shell.translations.length; i++) {
          if (this.int_comment_shell.translations[i].lang == pr.lang) {
            this.int_comment_shell.translations.splice(i, 1);
            this.int_comment_shell.translations.push(JSON.parse(JSON.stringify(pr)))
            break;
          }
        }
      });
      
      }
  },



  created () {
    this.createShell()
    this.loading = true
    console.log(this.$store);
    this.$store.dispatch('flows/fetchFlows')
      .then(processes => {
        this.loading = false
      })  
      this.$store.dispatch('comments/fetchComments')
      .then(comments => {
        this.loading = false
      })  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top: 50px;
  padding-right: 80px;
  padding-bottom: 50px;
  padding-left: 80px;
}


</style>
