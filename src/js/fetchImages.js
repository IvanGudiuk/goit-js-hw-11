import axios from 'axios';
import Notiflix from 'notiflix';
const URL = 'https://pixabay.com/api/';
export async function fetchImages(tag, pg) {
  const searchParams = {
    params: {
      key: '33902556-cd401344584c8349e7f35e0d0',
      q: tag,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: pg,
      per_page: 40,
    },
  };
  try {
    const response = await axios.get(`${URL}?`, searchParams);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return response;
  } catch (error) {
    console.log(error);
  }
}
