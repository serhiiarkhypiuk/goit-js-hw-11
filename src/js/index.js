import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

axios.get('/users').then(res => {
  console.log(res.data);
});
