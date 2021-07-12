import { axiosInstance } from 'boot/axios'

function error_handler(error) {
  console.log("ERROR IN CALLING API MANAGER")
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
}

export default {
  fetchDocumentTypePictures() {
    return axiosInstance
      .get('/backend/1.0.0/picture-hotspots?filter[include][0][relation]=translations')
      .then(response => response.data)
      .catch(error_handler);
  },
  fetchDocumentTypePicturesById(id) {
    return axiosInstance
      .get('/backend/1.0.0/picture-hotspots?filter[include][0][relation]=translations&filter[where][pictureId]=' + id)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveSpotTranslationProd (id) {

    // create fake id here
    return axiosInstance
      .get('/backend/1.0.0/picture-hotspots/to-production?pht_id=' + id)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteSpotTranslationProd (id) {
    // create fake id here
    return axiosInstance
      .delete('/backend/1.0.0/picture-hotspots/' + id + '/picture-hotspot-translation-prods')
      .then(response => response.data)
      .catch(error_handler);
  },
  fetchSpotTranslated (id) {

    return axiosInstance
      .get('/backend/1.0.0/picture-hotspots/' + id + '/picture-hotspot-translations')
      .then(response => response.data)
      .catch(error_handler);
  },
  fetchDocumentTypePicturesByIdGraph(id, defaultlang, currentLang) {
    return axiosInstance
      .get('/backend/1.0.0/picture-hotspots-migrant?defaultlang='+ defaultlang + '&currentlang=' + currentLang + '&pictureId=' + id)
      .then(response => response.data)
      .catch(error_handler);
  }

}
  
  

