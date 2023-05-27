import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries'; // Іменований імпорт

const DEBOUNCE_DELAY = 300; //встановлюється затримка для функції debounce

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY)); // очищує вміст HTML-елемента, переданого як параметр


function searchCountries(e) {
  clearAllMarkUp();
  if (e.target.value === "") {
      return
  }
  else {
    fetchCountries(e.target.value.trim())
      .then(countries => {
        if (countries.length <= 10 && countries.length > 1) {
          countries.forEach(({flags, name}) =>
            createListMarkUp(flags.png, name.official)
          );
        } else if (countries.length === 1) {
          createCountryInfoPlate({
            flaglink: countries[0].flags.png,
            flagAlt: countries[0].flags.alt,
            name: countries[0].name.official,
            population: countries[0].population,
            capital: countries[0].capital,
            languages: Object.values(countries[0].languages).join(', '),
          });
        } else if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch((error) => {
        if (error.message === '404') {
          Notify.failure('Oops, there is no country with that name');
        }
        else {
           Notify.failure(error.message);
        }
      })
       
  }
    
}

// вибираємо країну одн із списку кліком
function createListMarkUp(flagLink, country) {
       const listItem = document.createElement('li');
    const markUp = `<p><img src="${flagLink}" alt="" height="100"> ${country}</p>`;
    listItem.innerHTML = markUp;
    listItem.addEventListener('click', () => {
        selectCountry(country);
    });
    refs.countryList.appendChild(listItem); 
}

function selectCountry(countryName) {
    fetchCountries(countryName.trim())
        .then(data => {
            clearAllMarkUp();
            createCountryInfoPlate({
                flaglink: data[0].flags.png,
                flagAlt: data[0].flags.alt,
                name: data[0].name.official,
                population: data[0].population,
                capital: data[0].capital,
                languages: Object.values(data[0].languages).join(', '),
            });
        })
        .catch(() => {
            clearAllMarkUp();
            Notiflix.Notify.failure('Oops');
        });
}
// const inputHandler = e => {
//     const textInput = e.target.value.trim(); // trim()видаляє пробіли значень полів уведення

//     if (!textInput) {
//         [countryList, countryInfo].forEach(cleanMarkup);
//         return;
//     }

//     fetchCountries(textInput)
//         .then(data => {
//             data.length > 10 ?
//                 Notiflix.Notify.info('Too many matches found. Please enter a more specific name') :
//                 renderMarkup(data);
//         })
//         .catch(() => {
//             [countryList, countryInfo].forEach(cleanMarkup);
//             Notiflix.Notify.failure('Oops, there is no country with that name');
//         });
// };


// const renderMarkup = data => {
//   if (data.length === 1) {
//     cleanMarkup(countryList);
//     countryInfo.innerHTML = createInfoMarkup(data);
//   } else {
//     cleanMarkup(countryInfo);
//     countryList.innerHTML = createListMarkup(data);
//   }
// };



// const renderMarkup = data => {
//     if (data.length === 1) {
//         cleanMarkup(countryList);
//         countryInfo.innerHTML = createInfoMarkup(data);
//     } else {
//         cleanMarkup(countryInfo);
//         countryList.innerHTML = createListMarkup(data);

//         // Додаємо обробник подій до кожного елемента списку
//         const countryItems = document.querySelectorAll('.country-list li');
//         countryItems.forEach(item => {
//             item.addEventListener('click', () => {
//                 const countryName = item.textContent.trim();
//                 fetchCountries(countryName)
//                     .then(data => {
//                         cleanMarkup(countryList);
//                         countryInfo.innerHTML = createInfoMarkup(data);
//                     })
//                     .catch(() => {
//                         [countryList, countryInfo].forEach(cleanMarkup);
//                         Notiflix.Notify.failure('Oops, there is no country with that name');
//                     });
//             });
//         });
//     }
// };



function createCountryInfoPlate({flaglink, flagAlt, name, population, capital, languages}) {
  const markUp = `<div class="plate-wrap">
    <img src="${flaglink}" alt="${flagAlt}" height="100">
    <h2>${name}</h2>
      <ul>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Languages:</strong> ${languages}</p>
    </ul></div>`;
    refs.countryInfo.innerHTML = markUp;
}


function clearAllMarkUp() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}