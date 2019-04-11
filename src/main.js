import Filter from './filter.js';
import {getData} from './backend.js';
import List from './list.js';
import {countStatus, makeExtraList} from './filters-service.js';
import showMessage from './load-message.js';
import Statistic from './statistic.js';

const filterNames = [
  {name: `all`, fullname: `All movies`},
  {name: `watchlist`, fullname: `Watchlist`},
  {name: `history`, fullname: `History`},
  {name: `favorites`, fullname: `Favorites`}
];

/**
 * @description отрисовка данных после успешной загрузки
 *
 * @param {Array} films данные с сервера
 */
const onLoad = (films) => {
  document.body.removeChild(loadMessage);
  const topRatedCards = new List(makeExtraList(films, `rating`), topRatedContainer, false);
  const mostCommentedCards = new List(makeExtraList(films, `comments`), mostCommentedContainer, false);
  cards = new List(films, filmsContainer);

  cards.render();
  topRatedCards.render();
  mostCommentedCards.render();
  userStatus = countStatus(filters, films, filterBlock);
};

/**
 * @description показать/скрыть статистику при нажатии на кнопку Stat
 */
const showStatistic = () => {
  document.querySelector(`.films`).classList.toggle(`visually-hidden`);
  let stat = document.querySelector(`.statistic`);
  if (stat) {
    stat.remove();
  } else {
    stat = new Statistic(cards.filter(`history`), userStatus);
    document.querySelector(`.main`).appendChild(stat.render());
  }
};

/**
 * @description показать карточки, отфильтрованные по названию
 */
const titleSearch = () => {
  cards.changeFilter(new RegExp(searchField.value, `ig`));
  if (showMoreButton.classList.contains(`visually-hidden`)) {
    showMoreButton.classList.remove(`visually-hidden`);
  }
};

/**
 * @description показать еще карточки при нажатии на кнопку
 */
const showMore = () => {
  cards.render(cards.filter());
};

const loadMessage = showMessage();
const mainContainer = document.querySelector(`.films`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const topRatedContainer = document.querySelector(`.films-list--extra .films-list__container`);
const mostCommentedContainer = document.querySelector(`.films-list--extra:last-child .films-list__container`);
const showMoreButton = document.querySelector(`.films-list__show-more`);
const searchField = document.querySelector(`.search__field`);
let cards = {};
let userStatus = ``;
let filters = {watchlist: 0, history: 0, favorites: 0};
getData(onLoad);

const filterBlock = new Filter(filterNames);
filterBlock.onStatOpen = showStatistic;
filterBlock.onFilterChange = (status) => {
  cards.changeFilter(status);
  if (showMoreButton.classList.contains(`visually-hidden`)) {
    showMoreButton.classList.remove(`visually-hidden`);
  }
};

mainContainer.insertAdjacentElement(`beforebegin`, filterBlock.render());
showMoreButton.addEventListener(`click`, showMore);
searchField.addEventListener(`input`, titleSearch);
