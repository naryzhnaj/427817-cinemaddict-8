const CARDS_EXTRA_AMOUNT = 2;
const userNames = {
  [`movie buff`]: 21,
  fan: 11,
  novice: 0
};
const statuses = new Map([
  [`watchlist`, `watchlist`],
  [`already_watched`, `history`],
  [`favorite`, `favorites`]
]);

/**
 * @description отрисовать изменения при клике на рейтинги
 *
 * @param {String} status название рейтинга
 * @param {Boolean} isActive нужно ли увеличить значение счетчика
 * @param {Object} filters блок фильтров
 */
export const updateStatus = (status, isActive, filters) => {
  const filtername = statuses.get(status);
  if (filtername === `history`) {
    filters.userStatus = nameUser(filters.counts.history);
  }
  filters.update(filtername, isActive);
};

/**
 * @description составить список самых популярных фильмов
 *
 * @param {Array} data все фильмы
 * @param {String} field рейтинг, по которому сортируется
 *
 * @return {Array} отсортированный список нужной длины
 */
export const makeExtraList = (data, field) => {
  const indexArray = data.map((el, i) => i);
  if (field === `rating`) {
    indexArray.sort((a, b) => data[b].film_info.total_rating - data[a].film_info.total_rating);
  } else {
    indexArray.sort((a, b) => data[b].comments.length - data[a].comments.length);
  }
  return indexArray.slice(0, CARDS_EXTRA_AMOUNT).map((i) => data[i]);
};

/**
 * @description подсчет кол-ва фильмов в списках для панели фильтров
 *
 * @param {Array} data все фильмы
 * @param {Object} block блок фильтрации
 */
export const countStatus = (data, block) => {
  const filters = {};
  statuses.forEach((el) => {
    filters[el] = 0;
  });
  data.forEach((el) => {
    statuses.forEach((val, key) => {
      if (el.user_details[key]) {
        filters[val]++;
      }
    });
  });
  document.querySelector(`.footer__statistics`).firstChild.innerHTML = `${data.length} movies inside`;
  block.userStatus = nameUser(filters.history);
  block.setNumbers = filters;
};

/**
 * @description определить и вывести статус пользователя
 *
 * @param {Number} amount кол-во просмотренных
 *
 * @return {String} статус
 */
const nameUser = (amount) => {
  const users = Object.keys(userNames);
  let i = 0;
  while (amount < userNames[users[i]] && i < users.length) {
    i++;
  }
  document.querySelector(`.profile__rating`).innerHTML = users[i];
  return users[i];
};
