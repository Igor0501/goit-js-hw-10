import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries'; // Іменований імпорт

const DEBOUNCE_DELAY = 300; //встановлюється затримка для функції debounce

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const cleanMarkup = ref => ref.innerHTML = ''; // очищує вміст HTML-елемента, переданого як параметр

const inputHandler = e => {
    const textInput = e.target.value.trim(); // trim()видаляє пробіли значень полів уведення

    if (!textInput) {
        [countryList, countryInfo].forEach(cleanMarkup);
        return;
    }

    fetchCountries(textInput)
        .then(data => {
            data.length > 10 ?
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name') :
                renderMarkup(data);
        })
        .catch(() => {
            [countryList, countryInfo].forEach(cleanMarkup);
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

// const renderMarkup = data => {
//   if (data.length === 1) {
//     cleanMarkup(countryList);
//     countryInfo.innerHTML = createInfoMarkup(data);
//   } else {
//     cleanMarkup(countryInfo);
//     countryList.innerHTML = createListMarkup(data);
//   }
// };

const renderMarkup = data => {
    if (data.length === 1) {
        cleanMarkup(countryList);
        countryInfo.innerHTML = createInfoMarkup(data);
    } else {
        cleanMarkup(countryInfo);
        countryList.innerHTML = createListMarkup(data);

        // Додаємо обробник подій до кожного елемента списку
        const countryItems = document.querySelectorAll('.country-list li');
        countryItems.forEach(item => {
            item.addEventListener('click', () => {
                const countryName = item.textContent.trim();
                fetchCountries(countryName)
                    .then(data => {
                        cleanMarkup(countryList);
                        countryInfo.innerHTML = createInfoMarkup(data);
                    })
                    .catch(() => {
                        [countryList, countryInfo].forEach(cleanMarkup);
                        Notiflix.Notify.failure('Oops, there is no country with that name');
                    });
            });
        });
    }
};

const createListMarkup = data => data.map(({ name, flags }) => `
  <li>
    <img src="${flags.svg}" alt="${name.official}" height="100">
    ${name.official}
  </li>
`).join('');

function createInfoMarkup(data) {
    return data.map(({ name, capital, population, flags, languages }) => `
  <img src="${flags.svg}" alt="${name.official}" height="100">
  <h2>${name.official}</h2>
  <p><strong>Capital:</strong> ${capital}</p>
  <p><strong>Population:</strong> ${population}</p>
  <p><strong>Languages:</strong> ${Object.values(languages).join(', ')}</p>
`).join('');
}

searchBox.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));