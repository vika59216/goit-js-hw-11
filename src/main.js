import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

loader.style.display = 'none';
const searchParams = {
    key: '42200022-9c7e7676f0f903944c054771a',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    q: '',
}

form.addEventListener('submit', e => {
    e.preventDefault();
    loader.style.display = 'block';
    const inputValue = e.target.elements.input.value;
    searchParams.q = inputValue;
    getPhotoByName()
        .then(images => createGallery(images))
        .catch(error => console.log(error))
    e.target.reset();
});

function getPhotoByName() {
    const urlParams = new URLSearchParams(searchParams);
    return fetch(`https://pixabay.com/api/?${urlParams}`)
        .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(res.status);
        }
    })
}

function createGallery(images) {
    if (images.hits.length === 0) {
       iziToast.show({
            message: 'Sorry, there are no images matching your search query. Please try again!',
            messageColor: '#FFFFFF',
            backgroundColor: '#EF4040',
            position: 'topRight',
            messageSize: '16px',
            messageLineHeight: '24px',
            maxWidth: '432px',
       });
        gallery.innerHTML = '';
    } else {
        const link = images.hits.map(image => `<a class="gallery-link" href="${image.largeImageURL}">
        <img class="gallery-image"
        src="${image.webformatURL}"
        alt="${image.tags}"
         </a>
        <div class="img-content">
        <div>
        <h3>Likes</h3>
        <p>${image.likes}</p>
        </div>

        <div>
        <h3>Views</h3>
        <p>${image.views}</p>
        </div>

        <div>
        <h3>Comments</h3>
        <p>${image.comments}</p>
        </div>

        <div>
        <h3>Downloads</h3>
        <p>${image.downloads}</p>
        </div>
        </div>
        `).join('');
        gallery.innerHTML = link;
    }
    let lightBox = new SimpleLightbox('.gallery-link');
    lightBox.refresh();
    loader.style.display = 'none';
}