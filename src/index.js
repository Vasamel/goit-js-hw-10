import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(evt) {
    if (!evt.target.value) { 
        clearInput();
        Notiflix.Notify.warning('Please enter any data!');
        return;
    }
    return (fetchCountries(evt.target.value.trim())
    .then(showCountry)
    .catch(showError));
};

function showCountry(countries) {
    if (countries.length > 10) {
        clearInput();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }
    if (countries.length > 1 && countries.length <= 10) {
        clearInput();
        countryList.innerHTML = countryListMarkup(countries);
        return;
    }
    clearInput();
    countryInfo.innerHTML = countryInfoMarkup(countries);
}

function countryInfoMarkup(countries) {
    return countries
    .map(({ flags, name, capital, population, languages }) => {
        return `<img src="${flags.svg}" alt="${name.official}" width="50" height="50" />
        <h1>${name.official}</h1>
        <p><span>Capital:&#160;</span>${capital}</p>
        <p><span>Population:&#160;</span>${population}</p>
        <p><span>Languages:&#160;</span>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
};

function countryListMarkup(countries) {
    return countries.map(({ flags, name }) => {
        return `<li>
        <img src="${flags.svg}" alt="${name.official}" width="25" height="25" />
        <p>${name.official}</p>
        </li>`;
    })
    .join('');
}

function showError() {
  clearInput();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearInput() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}