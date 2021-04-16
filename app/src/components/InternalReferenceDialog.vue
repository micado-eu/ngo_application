<template>
    <q-card>
      <q-toolbar class="bg-accent text-white">
        <q-avatar>
          <img src="statics/icons/Icon - Internal Reference.svg">
        </q-avatar>

        <q-toolbar-title>{{title}}</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          @click="$emit('close', true)"
        />
      </q-toolbar>

      <q-card-section class="center-text">
        <slot></slot>
        <div class="q-mt-xl">
          {{$t("internal_reference.more_info_1")}} "<span class="more-info-title">{{title}}</span>" {{$t("internal_reference.more_info_2")}}
        </div>
        <div>
          <router-link
            class="q-mt-xl"
            :to="link"
          >
            {{fullLink}}
          </router-link>
        </div>
        <div>
          <q-btn
            class="q-mt-xl reference-btn"
            no-caps
            unelevated
            :to="link"
          >
            {{$t("internal_reference.go_to_reference")}}
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Internal Reference"
    },
    link: {
      type: String
    }
  },
  data() {
    return {
      getUrl: window.location
    }
  },
  computed: {
    fullLink() {
      return this.getUrl.protocol + "//" + this.getUrl.host + this.link
    }
  }
}
</script>

<style>
.more-info-title {
  color: #ff7c44;
}

.center-text {
  text-align: center;
}

.reference-btn {
  border-radius: 50px;
  border: 1px solid #ff7c44;
  color: black;
  font-weight: bold;
}
</style>