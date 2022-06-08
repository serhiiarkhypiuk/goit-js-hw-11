import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './fetchImages';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const input = document.querySelector('input[type=text]');
const loadMoreBtn = document.querySelector('button.load__more');
const gallery = document.querySelector('div.gallery');

const cleanMarkup = ref => (ref.innerHTML = '');
let pageNumber;
let searchQuery;

form.addEventListener('submit', inputHandler);

function inputHandler(event) {
  event.preventDefault();
  cleanMarkup(gallery);

  pageNumber = '1';
  searchQuery = input.value;

  if (!searchQuery) {
    return;
  }

  fetchImages(searchQuery, pageNumber)
    .then(data => {
      console.log(data);
      createImgMarkup(data);
      if (data.data.totalHits > 0) {
        Notiflix.Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
      }
      loadMoreBtn.style.visibility = 'visible';
    })
    .catch(err => {
      if (err.code === 'ERR_BAD_REQUEST') {
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.style.visibility = 'hidden';
      }
    });

  return searchQuery;
}

loadMoreBtn.addEventListener('click', () => {
  pageNumber++;
  fetchImages(searchQuery, pageNumber)
    .then(data => {
      console.log(data);
      createImgMarkup(data);
    })
    .catch(err => {
      if (err.code === 'ERR_BAD_REQUEST') {
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.style.visibility = 'hidden';
      }
    });
});

function createImgMarkup(data) {
  data.data.hits.forEach(hit => {
    const picWrapper = document.createElement('div');
    picWrapper.classList.add('gallery__item');

    const pic = document.createElement('a');
    pic.setAttribute('href', `${hit.largeImageURL}`);
    pic.innerHTML = `
      <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    `;

    const info = document.createElement('div');
    info.classList.add('info');
    info.innerHTML = `
        <p class="info-item">
          <b>Likes</b><span>${hit.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b><span>${hit.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b><span>${hit.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b><span>${hit.downloads}</span>
        </p>
      `;
    gallery.appendChild(picWrapper);
    picWrapper.appendChild(pic);
    picWrapper.appendChild(info);
  });
  new SimpleLightbox('.gallery div a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}
