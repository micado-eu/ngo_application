<template>
  <div  class="CoursesList">
    <div class="course" :key="course.id" v-for="course in courses">


      <input
        class="input"
        :value="course.title"
        placeholder="Type in the title of the task!"
        @input="e => { update(course, e.target.value) }"
      >


      <button class="icon" @click="destroy(course)">
      </button>
    </div>
  </div>
</template>

<script>
import Course from '../models/Course'

export default {
  // name: 'ComponentName',
  data () {
    return {}
  },
  computed: {
    courses () {
      return Course.query().orderBy('id', 'desc').get()
//      return Course.getAll()
    }
  },
  methods: {
    update (course, title) {
      course.$update({ title })
    },
    destroy (course) {
      course.$delete()
    }
  }
}
</script>
