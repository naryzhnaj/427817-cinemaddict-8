import renderFilterItem from './render-filter.js';
import renderCard from './render-card.js';
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
 * @description получить случайное число в диапазоне
 *
 * @param {Number} num максимум
 *
 * @return {Number} случайное число от 0 до num
 */
const getRandomNumber = (num) => Math.floor(Math.random() * num);

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
 * @description отрисовать карточки на странице
 *
 * @param {DOM-элемент} container родительский блок
 * @param {Number} num кол-во карточек
 * @param {Boolean} inMainBlock выводятся ли карточки в главный блок
 */
const renderCards = (container, num, inMainBlock = true) => {
  const films = makeFilmsList(num);

  films.forEach((film) => {
    container.insertAdjacentHTML(`beforeend`, renderCard(film, inMainBlock));
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
renderCards(topRatedContainer, cardsExtraAmount, false);
renderCards(mostCommentedContainer, cardsExtraAmount, false);
