import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
export { gallery };
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);

// Цей код дозволяє автоматично прокручувати сторінку на висоту 2 карток галереї, коли вона завантажується

function onSearchForm(e) {
  e.preventDefault();
  window.removeEventListener('scroll', showLoadMorePage);
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  async function makeMarkup(query, page, perPage) {
    try {
      const data = await fetchImages(query, page, perPage);
      
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.hits.length < data.totalHits) {
          window.addEventListener('scroll', showLoadMorePage);
          // Додати подію на прокручування сторінки, яка викликає функцію showLoadMorePage
        }
      }
    } catch {
      console.log(error);
    } finally {
      searchForm.reset();
    }
  }
  makeMarkup(query, page, perPage)
}

function onloadMore() {
  page += 1;
  
  simpleLightBox.destroy();
  
  async function makeMarkup(query, page, perPage) {
    try {
      const data = await fetchImages(query, page, perPage);
console.log(`data.hits.length:${data.hits.length}`);
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      const totalPages = Math.ceil(data.totalHits / perPage);
      if (page >= totalPages) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        window.removeEventListener('scroll', showLoadMorePage);
      }
    } catch {
      console.log(error);
    }
  }
  makeMarkup(query, page, perPage);
  // Цей код дозволяє автоматично прокручувати сторінку на висоту 2 карток галереї, коли вона завантажується
 const { height: cardHeight } = document
 .querySelector('.gallery')
 .firstElementChild.getBoundingClientRect();

window.scrollBy({
 top: cardHeight * 2,
 behavior: 'smooth',
});

// кнопка “вгору”->
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}

// Функція, яка виконуеться, якщо користувач дійшов до кінця сторінки
function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onloadMore();
  }
}
 