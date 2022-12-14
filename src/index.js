import './css/styles.css';
import { fetchPhoto } from './fetchPhoto';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

// подключение SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  widthRatio: 0.6,
  heightRatio: 0.9,
  scrollZoomFactor: 0.1,
});

const axios = require('axios');
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let fieldForSearchPhoto = '';
clearGallery();
btnLoadMore.style.visibility = 'hidden';
let page = 1;
let perPage = 40;
let totalHits = 0;
let currentHits = perPage;

form.addEventListener('input', onInputForm);
form.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onLoadMore);

function onInputForm(event) {
  fieldForSearchPhoto = event.target.value;
}

function onSubmitForm(event) {
  event.preventDefault();
  btnLoadMore.style.visibility = 'hidden';
  page = 1;
  totalHits = 0;
  currentHits = perPage;
  clearGallery();
  fieldForSearchPhoto = fieldForSearchPhoto.trim();
  if (fieldForSearchPhoto !== '') {
    fetchPhoto(fieldForSearchPhoto, page, perPage).then(response =>
      renderPhotoGallery(response)
    );
  } else {
    clearGallery();
    Notiflix.Notify.warning('Enter a filter to search for an image');
  }
}

function onLoadMore(event) {
  event.preventDefault();
  currentHits += perPage;
  page += 1;
  btnLoadMore.style.visibility = 'hidden';
  fetchPhoto(fieldForSearchPhoto, page, perPage).then(response =>
    renderPhotoGallery(response)
  );
}

function renderPhotoGallery(photos) {
  totalHits = photos.data.totalHits;
  const arrayPhoto = photos.data.hits;
  // Проверка на доступность изображений по выбранному фильтру
  // Очистка формы для ввода фильтра
  if (arrayPhoto.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    fieldForSearchPhoto = '';
    btnLoadMore.style.visibility = 'hidden';
    form.reset();
    return;
  } else {
    // вывод информации об общем кол-ве доступных изображений и текущем кол-ве полученых изображений
    // проверка на корректное кол-во доступных для скачивания изображений
    if (currentHits >= totalHits) {
      Notiflix.Notify.info(
        `Hooray! We found ${totalHits} totalHits images. Shown from 1 to ${totalHits}`
      );
    } else {
      Notiflix.Notify.info(
        `Hooray! We found ${totalHits} totalHits images. Shown from 1 to ${currentHits}`
      );
    }
  }

  makeMarcup(arrayPhoto);

  btnLoadMore.style.visibility = 'visible';
  // установление scroll smooth со скроллом экрана вверх после пролистывания первой страницы
  if (page > 1) {
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  // проверка и уведомление на окончание просмотра доступных изображений по фильтру с деактивацией кнопки Load More
  if (currentHits >= totalHits) {
    Notiflix.Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
    btnLoadMore.style.visibility = 'hidden';
    return;
  }
}

function makeMarcup(arrayPhoto) {
  const markup = arrayPhoto
    .map(photo => {
      return `<div class="photo-card">
      <a class="gallery__item gallery__link" href="${photo.largeImageURL}">
      <img class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
      </a>     
    <div class="info">
      <p class="info-item">
        <b class="item">Likes</b><br>${photo.likes}
      </p>
      <p class="info-item">
        <b class="item">Views</b><br>${photo.views}
      </p>
      <p class="info-item">
        <b class="item">Comments</b><br>${photo.comments}
      </p>
      <p class="info-item">
        <b class="item">Downloads</b><br>${photo.downloads}
      </p>
    </div>
  </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

// очистка галереи
function clearGallery() {
  gallery.innerHTML = '';
}