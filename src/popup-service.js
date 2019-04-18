import Popup from './popup.js';
import {updateData} from './backend.js';

const statusesFromPopup = new Map([
  [`watchlist`, `inWatchlist`],
  [`already_watched`, `isWatched`],
  [`favorite`, `isFavourite;`],
  [`personal_rating`, `userRating`]
]);

/**
 * @description копирование рейтингов из попапа в основную структуру
 *
 * @param {Object} popup экземпляр класса попапа
 * @param {Object} filmData данные соответствующего фильма
 *
 * @return {Boolean} isChanged наличие изменений
 */
const copyRating = (popup, filmData) => {
  let isChanged = false;

  statusesFromPopup.forEach((val, key) => {
    if (popup[val] !== filmData.user_details[key]) {
      isChanged = true;
      filmData.user_details[key] = popup[val];

      if (key === `already_watched`) {
        filmData.user_details[`watching_date`] = (filmData.user_details[key]) ? Date.now() : null;
      }
    }
  });
  return isChanged;
};

/**
 * @description действия над попапом при отправке/удалении коментария
 *
 * @param {Object} popup экземпляр класса попапа
 * @param {Object} filmData данные соответствующего фильма
 */
const updateComments = (popup, filmData) => {
  copyRating(popup, filmData);
  popup.block();

  updateData(filmData).then((data) => {
    popup.update(data.comments);
    filmData.comments = data.comments;
    popup.unblock();
  }).catch(() => popup.shake());
};

/**
 * @description отрисовать попап с подробностями фильма
 *
 * @param {Object} filmData данные соответствующего фильма
 */
export default (filmData) => {
  let placard = document.querySelector(`.film-details`);
  if (placard) {
    document.body.removeChild(placard);
  }
  const popup = new Popup(filmData);

  popup.onCloseClick = () => {
    return copyRating(popup, filmData) && updateData(filmData);
  };

  popup.onCommentAdd = (newComment) => {
    filmData.comments.push(newComment);
    updateComments(popup, filmData);
  };

  popup.onCommentDelete = () => {
    filmData.comments.pop();
    updateComments(popup, filmData);
  };

  placard = popup.render();
  document.body.appendChild(placard);
};
