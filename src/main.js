import Film from './film.js';
import Popup from './popup.js';
import Filter from './filter.js';
import makeFilmsList from './make-list.js';
import renderStatistics from './statistics.js';

const filters = [
  {name: `all`, fullname: `All movies`},
  {name: `watchlist`, fullname: `Watchlist`, count: 0},
  {name: `history`, fullname: `History`, count: 0},
  {name: `favorites`, fullname: `Favorites`, count: 0},
  {name: `stats`, fullname: `Stats`}
];

const cardsAmount = 7;
const cardsExtraAmount = 2;

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
      film.inWatchlist = !film.inWatchlist;
    };

    filmCard.onMarkAsWatched = (evt) => {
      evt.preventDefault();
      film.isWatched = !film.isWatched;
    };

    container.appendChild(filmCard.render());
  });
};

/**
 * @description отфильтровать карточки на странице
 *
 * @param {Array} films все фильмы
 * @param {String} filterName имя выбранного фильтра
 *
 * @return {Array} отфильтрованный массив
 */
const filterCards = (films, filterName) => {
  let cards;
  switch (filterName) {
    case `all`:
      cards = films;
      break;
    case `watchlist`:
      cards = films.filter((card) => card.inWatchlist);
      break;
    case `history`:
      cards = films.filter((card) => card.isWatched);
  }
  return cards;
};

const topRatedFilms = makeFilmsList(cardsExtraAmount);
const mostCommentedFilms = makeFilmsList(cardsExtraAmount);
const allFilms = makeFilmsList(cardsAmount);
const filterBlock = new Filter(filters);

filterBlock.onStatOpen = () => {
  mainContainer.classList.toggle(`visually-hidden`);
  stat.classList.toggle(`visually-hidden`);
  if (stat.className === `statistic`) {
    renderStatistics(filterCards(allFilms, `history`), `fanatic`);
  }
};

filterBlock.onFilterChange = (evt) => {
  evt.preventDefault();
  const filter = evt.target.id;
  if (filter === `all` || filter === `history` || filter === `watchlist`) {
    deleteCards(filmsContainer);
    renderCards(filmsContainer, filterCards(allFilms, filter));
  }
};

mainContainer.insertAdjacentElement(`beforebegin`, filterBlock.render());

renderCards(filmsContainer, allFilms);
renderCards(topRatedContainer, topRatedFilms);
renderCards(mostCommentedContainer, mostCommentedFilms);
