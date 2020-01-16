import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Organization extends Model {
  static entity = 'organizations'

  static fields () {
    return {
      id: this.uid(),
      name: this.string(''),
      description: this.string(''),
    }
  }
}
