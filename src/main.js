import renderFilterItem from './render-filter.js';
import renderCard from './render-card.js';

const filters = [
  {name: `all`, fullname: `All movies`},
  {name: `watchlist`, fullname: `Watchlist`},
  {name: `history`, fullname: `History`},
  {name: `favorites`, fullname: `Favorites`}];

const films = [
  {title: `The Assassination Of Jessie James By The Coward Robert Ford`,
    rating: 9.8,
    year: 2018,
    duration: `1h&nbsp;13m`,
    genre: `Comedy`,
    poster: `three-friends`,
    description: `A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.`},
  {title: `Incredibles 2`,
    rating: 9.8,
    year: 2018,
    duration: `1h&nbsp;13m`,
    genre: `Comedy`,
    poster: `accused`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun`}];

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
  for (let i = 0; i < num; i++) {
    container.insertAdjacentHTML(`beforeend`, renderCard(films[1], inMainBlock));
  }
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
