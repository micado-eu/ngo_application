import { Model } from '@vuex-orm/core'
import Organization from './Organization'

export default class Course extends Model {
  static entity = 'courses'

  static fields () {
    return {
      id: this.number(),
      title: this.string(''),
      description: this.string(''),
      owner: this.belongsTo(Organization, 'id')
    }
  }

  static getAll () {

//    return this.api().get()
    Course.insert({
      data: [
        { id: 1, title: 'John', description:'adesc' },
        { id: 2, title: 'Jane', description:'adesc' },
        { id: 3, title: 'Johnny', description:'adesc' }
      ]
    })
    
  }
}
