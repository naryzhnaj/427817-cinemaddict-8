import renderFilterItem from './render-filter.js';
import Film from './film.js';
import Popup from './popup.js';
import makeFilmsList, {getRandomNumber} from './make-list.js';

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
  const popup = new Popup(filmData).render();
  document.body.appendChild(popup);
};

/**
 * @description отрисовать карточки на странице
 *
 * @param {DOM-элемент} container родительский блок
 * @param {Number} num кол-во карточек
 */
const renderCards = (container, num) => {
  const films = makeFilmsList(num);

  const inMainBlock = (container === filmsContainer);

  films.forEach((film) => {
    const filmCard = new Film(film, inMainBlock);

    filmCard.onCommentsClick = () => renderPopup(filmCard._data);

    container.appendChild(filmCard.render());
  });
};

const filterBlock = filters.map((filter) =>
  renderFilterItem(filter, getRandomNumber(cardsRandomAmount))).join(``);

filterContainer.insertAdjacentHTML(`afterbegin`, filterBlock);

filterContainer.addEventListener(`click`, function (evt) {
  if (evt.target.className === `main-navigation__item`) {
    deleteCards(filmsContainer);
    renderCards(filmsContainer, getRandomNumber(cardsRandomAmount));
  }
});

renderCards(filmsContainer, cardsRandomAmount);
renderCards(topRatedContainer, cardsExtraAmount);
renderCards(mostCommentedContainer, cardsExtraAmount);
