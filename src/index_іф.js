import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
 
refs.inputEl.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));




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

function createListMarkUp(flagLink, country) {
    const markUp = `<li class="list-item">
        <p><img src="${flagLink}" alt="" width = 30px>    ${country}</p>
      </li>`;
    refs.countryList.insertAdjacentHTML('beforeend', markUp);  
}

function createCountryInfoPlate({flaglink, flagAlt, name, population, capital, languages}) {
  const markUp = `<div class="plate-wrap">
    <h1><img src="${flaglink}" alt="${flagAlt}" width= 30px>  ${name}</h1>
      <ul>
        <li><span>Capital:</span> ${capital}</li>
        <li><span>Population:</span> ${population}</li>
        <li><span>Languages:</span> ${languages}</li>
    </ul></div>`;
    refs.countryInfo.innerHTML = markUp;
}

function clearAllMarkUp() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}