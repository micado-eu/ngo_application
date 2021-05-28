<template>
  <div>
    <div :class="inline ? 'row' : ''">
      <q-field
        outlined
        bg-color="grey-3"
        :class="inline ? 'col cursor-pointer q-mr-md' : 'cursor-pointer q-mb-sm'"
        :readonly="readonly"
      >
        <template v-slot:prepend>
          <q-icon
            name="event"
            data-cy="date_icon"
          >
          </q-icon>
        </template>
        <template v-slot:control>{{internalDate}}</template>
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-date
              v-model="internalDate"
              mask="YYYY-MM-DD"
              color="accent"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  :label="$t('date_selector.close')"
                  color="accent"
                  flat
                  data-cy="close_date_menu"
                />
              </div>
            </q-date>
          </div>
        </q-popup-proxy>
      </q-field>
      <q-field
        outlined
        bg-color="grey-3"
        :readonly="readonly"
        :class="inline ? 'col cursor-pointer': 'cursor-pointer'"
      >
        <template v-slot:prepend>
          <q-icon
            name="access_time"
            data-cy="time_icon"
          >
          </q-icon>
        </template>
        <template v-slot:control>
          {{internalTime}}
        </template>
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-time
              v-model="internalTime"
              mask="HH:mm"
              format24h
              color="accent"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  :label="$t('date_selector.close')"
                  color="accent"
                  flat
                  data-cy="close_date_menu"
                />
              </div>
            </q-time>
          </div>
        </q-popup-proxy>
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  props: ['date', 'time', 'readonly', 'inline'], // Date and time comes in UTC
  data() {
    return {
      internalDate: this.date,
      internalTime: this.time
    }
  },
  watch: {
    internalDate(val) {
      this.$emit('inputDate', val)
    },
    internalTime(val) {
      this.$emit('inputTime', val)
    }
  }
}
</script>

<style>
</style>