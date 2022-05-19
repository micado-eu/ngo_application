export default {
  data() {
    return {
      show_dialog: false
    }
  },
  props: {
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
  computed: {
    staticUrl() { return "/statics/csv/" + this.entity + ".csv" }
  }
}