import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

// обозначаем элементы
const inputForm = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryEl = document.querySelector('.country-info');

// добавляем событие и задержку
inputForm.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

// условия для ввода в инпут
function onInputChange() {
  const name = inputForm.value.trim();
  if (name === '') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return (listEl.innerHTML = ''), (countryEl.innerHTML = '');
  }
  fetchCountries(name)
    .then(response => {
      listEl.innerHTML = '';
      countryEl.innerHTML = '';

      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length < 10 && response.length >= 2) {
        listEl.insertAdjacentHTML('beforeend', renderCountryList(response));
      } else {
        countryEl.insertAdjacentHTML('beforeend', renderCountryInfo(response));
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return;
    });
}

// рендер по условию
function renderCountryList(amount) {
  return amount
    .map(({ flags, name }) => {
      return `
          <li class="country-list__item">
              <img src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 50px>
              <h2>${name.official}</h2>
          </li>`;
    })
    .join('');
}

function renderCountryInfo(amount) {
  return amount
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <img width="200px" height="100px" src='${flags.svg}' 
      alt='${name.official} flag' />
        <ul>
            <li><p><b>Name: </b>${name.official}</p></li>
            <li><p><b>Capital: </b>${capital}</p></li>
            <li><p><b>Population: </b>${population}</p></li>
            <li><p><b>Languages: </b>${Object.values(languages)}</p></li>
        </ul>`;
    })
    .join('');
}
