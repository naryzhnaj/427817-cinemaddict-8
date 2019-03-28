import Film from './film.js';
import Popup from './popup.js';
import Filter from './filter.js';
import {getData} from './backend.js';
import renderStatistics from './statistics.js';

const filterNames = [
  {name: `all`, fullname: `All movies`},
  {name: `watchlist`, fullname: `Watchlist`},
  {name: `history`, fullname: `History`},
  {name: `favorites`, fullname: `Favorites`}
];

const cardsAmount = 7;
const cardsExtraAmount = 2;

let allFilms = [];

/**
 * @description загрузить данные
 *
 * @param {Object} films данные с сервера
 */
const onLoad = (films) => {
  renderCards(filmsContainer, films.slice(0, cardsAmount));
  renderCards(topRatedContainer, films.slice(0, cardsExtraAmount));
  renderCards(mostCommentedContainer, films.slice(-cardsExtraAmount));
  allFilms = Array.from(films);
};

getData(onLoad);

const mainContainer = document.querySelector(`.films`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const topRatedContainer = document.querySelector(`.films-list--extra .films-list__container`);
const mostCommentedContainer = document.querySelector(`.films-list--extra:last-child .films-list__container`);
const stat = document.querySelector(`.statistic`);

/**
 * @description удалить текущие карточки
 *
 * @param {DOM-элемент} container родительский блок
 */
const deleteCards = (container) => {
  const cards = container.querySelectorAll(`.film-card`);

  cards.forEach((card) => {
    card.remove();
  });
};

/**
 * @description отрисовать попап с подробностями фильма
 *
 * @param {Object} filmData данные соответствующего фильма
 */
const renderPopup = (filmData) => {
  const popup = new Popup(filmData);
  document.body.appendChild(popup.render());
};

/**
 * @description отрисовать карточки на странице
 *
 * @param {DOM-элемент} container родительский блок
 * @param {Array} films объекты с данными
 */
const renderCards = (container, films) => {
  const inMainBlock = (container === filmsContainer);

  films.forEach((film) => {
    const filmCard = new Film(film, inMainBlock);

    filmCard.onClick = () => renderPopup(film);

    filmCard.onAddToWatchList = (evt) => {
      evt.preventDefault();
      film.user_details.watchlist = !film.user_details.watchlist;
      if (film.user_details.watchlist) {
        filters.watchlist++;
      } else {
        filters.watchlist--;
      }
      filterBlock.update(`watchlist`, filters.watchlist);
    };

    filmCard.onMarkAsWatched = (evt) => {
      evt.preventDefault();
      film.user_details[`already_watched`] = !film.user_details[`already_watched`];
      if (film.user_details[`already_watched`]) {
        filters.history++;
      } else {
        filters.history--;
      }
      filterBlock.update(`history`, filters.history);
    };

    container.appendChild(filmCard.render());
  });
};

/**
 * @description отфильтровать карточки на странице
 *
 * @param {String} filterName имя выбранного фильтра
 *
 * @return {Array} отфильтрованный массив
 */
const filterCards = (filterName) => {
  let cards;
  switch (filterName) {
    case `all`:
      cards = allFilms;
      break;
    case `watchlist`:
      cards = allFilms.filter((card) => card.user_details.watchlist);
      break;
    case `history`:
      cards = allFilms.filter((card) => card.user_details.already_watched);
  }
  return cards;
};

const filterBlock = new Filter(filterNames);

filterBlock.onStatOpen = () => {
  mainContainer.classList.toggle(`visually-hidden`);
  stat.classList.toggle(`visually-hidden`);
  if (stat.className === `statistic`) {
    renderStatistics(filterCards(`history`), `fanatic`);
  }
};

filterBlock.onFilterChange = (evt) => {
  evt.preventDefault();
  const filterName = evt.target.id || ``;

  if (filterName === `all` || filterName === `history` || filterName === `watchlist`) {
    deleteCards(filmsContainer);
    renderCards(filmsContainer, filterCards(filterName));
  }
};

mainContainer.insertAdjacentElement(`beforebegin`, filterBlock.render());

const filters = {watchlist: 0, history: 0, favorites: 0};
// проставить числа в фильтрах
Object.keys(filters).forEach((name) =>
  filterBlock.update(name, filters[name])
);
