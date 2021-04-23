<template>
  <div :class="inline ? 'row' : ''">
    <q-input
      outlined
      bg-color="grey-3"
      v-model="internalDate"
      :class="inline ? 'col q-mr-md' : 'q-mb-sm'"
      :readonly="readonly"
    >
      <template v-slot:prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
          data-cy="date_icon"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
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
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      outlined
      bg-color="grey-3"
      v-model="internalTime"
      :readonly="readonly"
      :class="inline ? 'col': ''"
    >
      <template v-slot:prepend>
        <q-icon
          name="access_time"
          class="cursor-pointer"
          data-cy="time_icon"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
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
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
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