import Film from './film.js';
import Popup from './popup.js';
import Filter from './filter.js';
import {getData, updateData} from './backend.js';
import Statistic from './statistic.js';

const filterNames = [
  {name: `all`, fullname: `All movies`},
  {name: `watchlist`, fullname: `Watchlist`},
  {name: `history`, fullname: `History`},
  {name: `favorites`, fullname: `Favorites`}
];
const statuses = new Map([
  [`watchlist`, `watchlist`],
  [`already_watched`, `history`],
  [`favorite`, `favorites`]
]);
const CARDS_AMOUNT = 5;
const CARDS_EXTRA_AMOUNT = 2;

/**
 * @description подсчет кол-ва фильмов в списках для панели фильтров
 *
 * @param {Array} data все фильмы
 */
const countStatus = (data) => {
  data.forEach((el) => {
    statuses.forEach((val, key) => {
      if (el.user_details[key]) {
        filters[val]++;
      }
    });
  });
};

/**
 * @description отрисовка данных после успешной загрузки
 *
 * @param {Array} films данные с сервера
 */
const onLoad = (films) => {
  document.body.removeChild(loadMessage);
  renderCards(topRatedContainer, makeExtraList(films, `rating`));
  renderCards(mostCommentedContainer, makeExtraList(films, `comments`));
  renderCards(filmsContainer, films);

  allFilms = films;
  document.querySelector(`.footer__statistics`).firstChild.innerHTML = `${films.length} movies inside`;
  countStatus(films);
  Object.keys(filters).forEach((name) =>
    filterBlock.update(name, filters[name])
  );
  nameUser();
};

/**
 * @description составить список самых популярных фильмов
 *
 * @param {Array} data все фильмы
 * @param {String} field рейтинг, по которому сортируется
 *
 * @return {Array} отсортированный список нужной длины
 */
const makeExtraList = (data, field) => {
  const indexArray = data.map((el, i) => i);
  if (field === `rating`) {
    indexArray.sort((a, b) => data[b].film_info.total_rating - data[a].film_info.total_rating);
  } else {
    indexArray.sort((a, b) => data[b].comments.length - data[a].comments.length);
  }
  return indexArray.slice(0, CARDS_EXTRA_AMOUNT).map((i) => data[i]);
};

/**
 * @description удалить текущие карточки
 *
 * @param {DOM-элемент} container родительский блок
 */
const deleteCards = (container) => {
  const cards = container.querySelectorAll(`.film-card`);
  renderedAmount = 0;
  cards.forEach((card) => {
    card.remove();
  });
};

const copyRating = (popup, userData) => {
  userData.favorite = popup.isFavourite;
  userData[`already_watched`] = popup.isWatched;
  userData.watchlist = popup.inWatchlist;
  userData[`personal_rating`] = popup.userRating;
};

/**
 * @description отрисовать попап с подробностями фильма
 *
 * @param {Object} filmData данные соответствующего фильма
 */
const renderPopup = (filmData) => {
  let placard = document.querySelector(`.film-details`);
  if (placard) {
    document.body.removeChild(placard);
  }
  const popup = new Popup(filmData);

  popup.onCloseClick = () => {
    copyRating(popup, filmData[`user_details`]);
  };

  popup.onCommentAdd = (newComment) => {
    filmData.comments.push(newComment);
    copyRating(popup, filmData[`user_details`]);
    popup.block();

    updateData(filmData).then((data) => {
      popup.update(data.comments);
      filmData.comments = data.comments;
      popup.unblock();
    }).catch(() => popup.shake());
  };

  popup.onCommentDelete = () => {
    filmData.comments.pop();
    copyRating(popup, filmData[`user_details`]);
    popup.block();

    updateData(filmData).then((data) => {
      popup.update(data.comments);
      filmData.comments = data.comments;
      popup.unblock();
    });
  };

  placard = popup.render();
  document.body.appendChild(placard);
};

/**
 * @description отрисовать изменения при клике на рейтинги
 *
 * @param {String} status название рейтинга
 * @param {Boolean} isActive нужно ли увеличить значение счетчика
 */
const updateStatus = (status, isActive) => {
  const filtername = statuses.get(status);
  if (isActive) {
    filters[filtername]++;
  } else {
    filters[filtername]--;
  }
  filterBlock.update(filtername, filters[filtername]);

  if (filtername === activeList) {
    deleteCards(filmsContainer);
    renderCards(filmsContainer, filterCards(activeList));
  }
};

/**
 * @description определить и вывести статус пользователя
 */
const nameUser = () => {
  const amount = filters.history;
  if (amount < 11) {
    userStatus = `novice`;
  } else if (amount < 21) {
    userStatus = `fan`;
  } else {
    userStatus = `movie buff`;
  }
  document.querySelector(`.profile__rating`).innerHTML = userStatus;
};

/**
 * @description отрисовать карточки на странице
 *
 * @param {DOM-элемент} container родительский блок
 * @param {Array} films объекты с данными
 */
const renderCards = (container, films) => {
  const inMainBlock = (container === filmsContainer);
  const cards = films.slice(renderedAmount, renderedAmount + CARDS_AMOUNT);

  cards.forEach((film) => {
    const filmCard = new Film(film, inMainBlock);

    filmCard.onClick = () => renderPopup(film);

    filmCard.onAddToWatchList = () => {
      film.user_details.watchlist = !film.user_details.watchlist;
      updateStatus(`watchlist`, film.user_details.watchlist);
    };

    filmCard.onMarkAsWatched = () => {
      film.user_details[`already_watched`] = !film.user_details[`already_watched`];
      updateStatus(`already_watched`, film.user_details[`already_watched`]);
      nameUser();
    };

    filmCard.onMarkAsFavorite = () => {
      film.user_details.favorite = !film.user_details.favorite;
      updateStatus(`favorite`, film.user_details.favorite);
    };

    container.appendChild(filmCard.render());
  });

  if (inMainBlock) {
    renderedAmount += CARDS_AMOUNT;
    if (films.length <= renderedAmount) {
      showMoreButton.classList.add(`visually-hidden`);
    }
  }
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
      break;
    case `favorites`:
      cards = allFilms.filter((card) => card.user_details.favorite);
  }
  return cards;
};

/**
 * @description показать еще карточки при нажатии на кнопку
 */
const showMore = () => {
  renderCards(filmsContainer, filterCards(activeList));
};

/**
 * @description показать карточки, отфильтрованные по названию
 */
const titleSearch = () => {
  activeList = new RegExp(searchField.value, `ig`);
  deleteCards(filmsContainer);
  renderCards(filmsContainer, allFilms.filter((el) => activeList.test(el.film_info.title)));
};

const loadMessage = document.createElement(`div`);
loadMessage.style = `width: 800px; margin: 20px auto; padding: 10px; text-align: center; background-color: yellow; color: black; font-size: 24px;`;
loadMessage.textContent = `Loading movies...`;
document.body.appendChild(loadMessage);

const mainContainer = document.querySelector(`.films`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const topRatedContainer = document.querySelector(`.films-list--extra .films-list__container`);
const mostCommentedContainer = document.querySelector(`.films-list--extra:last-child .films-list__container`);
const main = document.querySelector(`.main`);
const showMoreButton = document.querySelector(`.films-list__show-more`);
const searchField = document.querySelector(`.search__field`);

let renderedAmount = 0;
let allFilms = [];
let activeList = `all`;
let userStatus = ``;

const filters = {watchlist: 0, history: 0, favorites: 0};
getData(onLoad);
const filterBlock = new Filter(filterNames);

/**
 * @description показать/скрыть статистику при нажатии на кнопку Stat
 */
filterBlock.onStatOpen = () => {
  mainContainer.classList.toggle(`visually-hidden`);
  let stat = document.querySelector(`.statistic`);
  if (stat) {
    main.removeChild(stat);
  } else {
    stat = new Statistic(filterCards(`history`), userStatus);
    main.appendChild(stat.render());
  }
};

/**
 * @description при переключении фильтра блок очищается и выводится новый список
 *
 * @param {String} filterName имя выбранного фильтра
 */
filterBlock.onFilterChange = (filterName) => {
  if (activeList !== filterName) {
    deleteCards(filmsContainer);
    activeList = filterName;
    renderCards(filmsContainer, filterCards(filterName));

    if (showMoreButton.classList.contains(`visually-hidden`)) {
      showMoreButton.classList.remove(`visually-hidden`);
    }
  }
};

mainContainer.insertAdjacentElement(`beforebegin`, filterBlock.render());
showMoreButton.addEventListener(`click`, showMore);
searchField.addEventListener(`input`, titleSearch);
