<template>
  <q-page padding>
    <div class="header">
      <h2 class="title">Courses</h2>
      <button class="button" @click="add">ADD COURSE</button>
    </div>

    <CourseList />
  </q-page>
</template>

<script>
import Course from '../models/Course'
import CourseList from '../components/CourseList'

export default {
  // name: 'PageName',
  components: {
    CourseList
  },
  computed: {

  },
  created () {
    Course.getAll()
  },
  methods: {
    add () {
      Course.insert({
        data: { title: 'new course', description: 'nice course' }
      })
    }
  }
}
</script>
