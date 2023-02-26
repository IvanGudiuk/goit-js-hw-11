import './css/styles.css';
import { fetchImages } from './js/fetchImages';
import { renderMarkup } from './js/renderMarkup';
import Throttle from 'lodash.throttle';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', { overlayOpacity: 0.9 });
const searchInput = document.querySelector('[name="searchQuery"]');
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
let pageCounter = 1;

function handleSearchClick(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  pageCounter = 1;
  const queryWords = e.target.elements.searchQuery.value;
  fetchImages(queryWords, pageCounter).then(res => {
    if (res.data.hits.length !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    }
    const markup = renderMarkup(res);
    gallery.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.gallery a', { overlayOpacity: 0.9 });
    pageCounter += 1;
  });
}
function loadMoreImages(e) {
  e.preventDefault();
  const scrollHeight = e.target.documentElement.scrollHeight;
  const windowHeight = e.target.documentElement.clientHeight;
  const scrollPos = e.target.documentElement.scrollTop;
  const position = scrollHeight - windowHeight - scrollPos;
  const searchWords = searchInput.value;

  if (position < 500) {
    fetchImages(searchWords, pageCounter).then(res => {
      const totalPages = res.data.totalHits;
      const perPage = res.data.hits.length;
      const pagesQuantity = totalPages / perPage;
      if (pageCounter < pagesQuantity) {
        const markup = renderMarkup(res);
        gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        pageCounter += 1;
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  }
}
searchForm.addEventListener('submit', handleSearchClick);
window.addEventListener('scroll', Throttle(loadMoreImages, 1000));

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
