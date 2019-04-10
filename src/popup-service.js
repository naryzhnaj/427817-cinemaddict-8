import Popup from './popup.js';
import {updateData} from './backend.js';

/**
 * @description копирование рейтингов из попапа в основную структуру
 *
 * @param {Object} popup
 * @param {Object} userData
 */
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
export default (filmData) => {
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
