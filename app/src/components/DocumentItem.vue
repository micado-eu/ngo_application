<template>
<div>
  <q-item style="padding-left:0px;width:100%" :key="this.theDoc.id">
    <q-item-section class="">
      <q-item-label class="doc-name">{{this.theDoc.text}}</q-item-label>
      <q-item-label class="doc-fields" style="padding-top:10px" caption>{{$t('desc_labels.emitter')}}:{{this.theDoc.emitter}}</q-item-label>
      <q-item-label class="doc-fields" style="padding-top:6px" caption>{{$t('events.cost')}}: {{this.theDoc.price}}</q-item-label>

    </q-item-section>
    <q-item-section>
 
    <div class="" style="padding-right:0px; text-align:center" avatar>
      <q-btn
      
        dense
        unelevated
        @click.native="showDoc()"
        :key="theDoc.id"
        :id="theDoc.id"
        :disabled="!this.isInWallet"
        :class="[{in_wallet: this.isInWallet},{not_in_wallet: !this.isInWallet}]"
      >
        <q-avatar   rounded>
          <img  :src="this.theDoc.image">
        </q-avatar>
      </q-btn>
    </div>
    <div class="row" style="width:100%">
    <div v-if="theDoc.model != ' '" class="col models-container" >
        <a
          class="models"
          clickable
          @click="showModel()"
          href="javascript:void(0)"
        >
        {{$t('button.view_model')}}
        </a>
    </div>
<div v-if="pictures"  class="col models-container" >
          <a
          class="models"
          clickable
          @click="show = true"
          href="javascript:void(0)"
        >
        {{$t('button.view_pics')}}
        </a>                
</div>

    
      
    </div>
    </q-item-section>
    </q-item>
   
    <q-dialog
      v-model="show"
      @hide="clean()"
      @show="showPictures($event)"
    >
      <div>
        <div style="background-color:white">
          <div style="text-align:right">
          <q-btn  flat v-close-popup round dense icon="close" />
          </div>
        </div>
        <q-carousel
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          animated
          control-color="primary"
          class="rounded-borders"
        >
        
          <q-carousel-slide
            class="column no-wrap flex-center"
            v-for="picture in pictures"
            :key="picture.id"
            :name="picture.id"
          >
            <q-card-section>
              <DocumentHotspot
                :picture="picture.image"
                :data="data"
              />
            </q-card-section>
          </q-carousel-slide>
        </q-carousel>
        <div
          class="row justify-center"
          style="background-color:white"
        >
          <q-btn-toggle
            glossy
            color="accent"
            v-model="slide"
            @input="transitioning($event)"
            :options="options"
          />
        </div>
      </div>
    </q-dialog>
</div>

</template>

<script>
const DocumentHotspot = () => import('./DocumentHotspot')

//
export default {
  // name: 'ComponentName',
  props: ['theDoc', 'pictures', 'isInWallet', 'options', "data"],
  components: {
    DocumentHotspot
  },
  data () {
    return {
      show: false,
      slide: null
    }
  },
  computed: {
  },
  methods: {
    showModel(){
      let pdfWindow = window.open("")
    pdfWindow.document.write(
    "<iframe width='100%' height='100%' src='" +
    this.theDoc.model + "'></iframe>"
)
    },
    transitioning (event) {
      console.log(event)
      this.$emit('transition', { pic_id: event, doc_id: this.theDoc.id })
    },
    generateForm () {
      this.$router.push({ name: "certificates", params: { certificateId: '123' } });
    },
    showPictures (event) {
      console.log("showing")
      this.slide = this.theDoc.pictures[0].id
      this.$emit('showpicture')
    },
    showDoc () {
      console.log("showing doc")
      this.$emit('showdoc')
    },
    clean () {
      this.$emit('clean')
    }
  }
}

</script>
<style scoped>
.doc-name{
  font-family: Nunito Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
}
.doc-fields{
  font-family: Nunito Sans;
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 14px;
  color: #000000;
}
.image {
  max-width: 80%;
  max-height: 80%;
}
.in_wallet {
  filter: invert(48%) sepia(90%) saturate(3207%) hue-rotate(100deg)
    brightness(95%) contrast(100%);
}
.not_in_wallet {
  pointer-events: none;
}
.models{
  font-family: Nunito Sans;
font-style: normal;
font-weight: 300;
font-size: 10px;
line-height: 14px;
}
.models-container{
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>