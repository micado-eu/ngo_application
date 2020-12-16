import { axiosInstance, getCancelTokenSource, isCancel } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  uploadImage(imageFile, onUploadProgressFn = null) {
    const form = new FormData()
    form.append('image', imageFile)
    const cancelTokenSource = getCancelTokenSource()
    let config = {
      cancelToken: cancelTokenSource.token
    }
    if (onUploadProgressFn !== null) {
      config = Object.assign(config, {
        onUploadProgress: onUploadProgressFn
      })
    }
    // Returns in [0] the promise and in [1] the cancel token
    return [
      axiosInstance
        .post('/backend/1.0.0/upload-image', form, config)
        .then((response) => response.data)
        .catch(error_handler),
      cancelTokenSource
    ]
  },
  isRequestCancel(thrown) {
    return isCancel(thrown)
  }
}