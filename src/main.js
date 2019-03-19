import renderFilterItem from './render-filter.js';
import Film from './film.js';
import Popup from './popup.js';
import Filter from './filter.js';
import makeFilmsList from './make-list.js';

const filters = [
  {name: `all`, fullname: `All movies`},
  {name: `watchlist`, fullname: `Watchlist`},
  {name: `history`, fullname: `History`},
  {name: `favorites`, fullname: `Favorites`}];

const cardsRandomAmount = 7;
const cardsExtraAmount = 2;

const filterContainer = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const topRatedContainer = document.querySelector(`.films-list--extra .films-list__container`);
const mostCommentedContainer = document.querySelector(`.films-list--extra:last-child .films-list__container`);

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

    filmCard.onCommentsClick = () => renderPopup(film);

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

const topRatedFilms = makeFilmsList(cardsExtraAmount);
const mostCommentedFilms = makeFilmsList(cardsExtraAmount);
const allFilms = makeFilmsList(cardsRandomAmount);

const filterBlock = filters.map((filter) =>
  renderFilterItem(filter, 0)).join(``);

filterContainer.insertAdjacentHTML(`afterbegin`, filterBlock);

filterContainer.addEventListener(`click`, function (evt) {
  if (evt.target.className === `main-navigation__item`) {
    deleteCards(filmsContainer);
    renderCards(filmsContainer, cardsRandomAmount);
  }
});

renderCards(filmsContainer, allFilms);
renderCards(topRatedContainer, topRatedFilms);
renderCards(mostCommentedContainer, mostCommentedFilms);
