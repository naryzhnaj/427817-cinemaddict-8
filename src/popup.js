import Component from './component.js';
import moment from 'moment';

const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
const MAX_RATING = 9;

const getEmoji = (emotion) => {
  const face = {sleeping: `😴`, [`neutral-face`]: `😐`, grinning: `😀`}[emotion];
  return (face) ? face : ``;
};

export default class Popup extends Component {
  constructor(data) {
    super();
    this._title = data.film_info.title;
    this._original = data.film_info.alternative_title;
    this._release = moment(new Date(data.film_info.release.date)).format(`DD MMMM YYYY`);
    this._duration = data.film_info.runtime;
    this._genre = data.film_info.genre;
    this._poster = data.film_info.poster;
    this._description = data.film_info.description;
    this._rating = data.film_info.total_rating;
    this._country = data.film_info.release.release_country;
    this._age = data.film_info.age_rating;
    this._director = data.film_info.director;
    this._writer = data.film_info.writers;
    this._actors = data.film_info.actors;
    this._comments = data.comments;
    this.userRating = data.user_details.personal_rating;
    this.isFavourite = data.user_details.favorite;
    this.isWatched = data.user_details.already_watched;
    this.inWatchlist = data.user_details.watchlist;

    this._onKeyPressed = this._onKeyPressed.bind(this);
  }

  get renderComments() {
    return `${this._comments.map((comment) =>
      `<li class="film-details__comment">
      <span class="film-details__comment-emoji">${getEmoji(comment.emotion)}</span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${moment(new Date(comment.date)).fromNow()}</span>
        </p>
      </div>
    </li>`).join(``)}`;
  }

  get template() {
    const popup = document.createElement(`section`);
    popup.className = `film-details`;
    popup.innerHTML = `<form class="film-details__inner" action="" method="get">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${this._poster}" alt=${this._title}>
        <p class="film-details__age">${this._age}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${this._title}</h3>
            <p class="film-details__title-original">${this._original}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${this._rating}</p>
            <p class="film-details__user-rating">Your rate ${this.userRating ? this.userRating : ``}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${this._director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${this._writer}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${this._actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${this._release} (${this._country})</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${this._duration} min</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${this._country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
  ${this._genre.map((genre) =>
    `<span class="film-details__genre">${genre}</span>`).join(` `)}
            </td>
          </tr>
        </table>
        <p class="film-details__film-description">${this._description}</p>
      </div>
    </div>

    <section class="film-details__controls visually-hidden">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="toWatchlist"
        ${this.inWatchlist ? `checked` : ``} name="toWatchlist">
      <label for="toWatchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched"
        ${this.isWatched ? `checked` : ``} name="watched">
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite"
        ${this.isFavourite ? `checked` : ``} name="favorite">
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>

    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
      <ul class="film-details__comments-list">${this.renderComments}</ul>
      <div class="film-details__new-comment">
        <div>
          <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
          <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face">
            <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
            <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
          </div>
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
        </label>
      </div>
    </section>

    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <span class="film-details__watched-status film-details__watched-status--active">${this.isWatched ? `Already watched` : `will watch`}</span>
        <button class="film-details__watched-reset" type="button">undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
      </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._title}</h3>
          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
  ${new Array(MAX_RATING).fill().map((val, i)=> 1 + i).map((i) =>
    `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value=${i} id="rating-${i}">
            <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`).join(``)}
          </div>
        </section>
      </div>
    </section>
  </form>`;
    return popup;
  }

  update(comments) {
    this._comments = comments;
    this._element.querySelector(`.film-details__comments-list`).innerHTML = this.renderComments;
  }

  _onKeyPressed(evt) {
    if (evt.keyCode === ENTER_KEYCODE && evt.ctrlKey) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const comment = {
        author: `user`,
        comment: formData.get(`comment`),
        emotion: formData.get(`comment-emoji`),
        date: Date.now()
      };

      if (typeof this._onCommentSend === `function`) {
        this._onCommentSend(comment);
        this._element.querySelector(`.film-details__comment-input`).value = ``;
        this._element.querySelector(`.film-details__add-emoji-label`).innerHTML = `😐`;
        this._element.querySelector(`.film-details__controls`).classList.remove(`visually-hidden`);
        this._element.querySelector(`.film-details__watched-status`).innerHTML = `Comment added`;
      }
    } else if (evt.keyCode === ESC_KEYCODE) {
      this._onCloseClick();
    }
  }

  set onCloseClick(fn) {
    this._close = fn;
  }

  _onCloseClick() {
    if (typeof this._close === `function`) {
      this._close();
      this._element.remove();
      document.removeEventListener(`keydown`, this._onKeyPressed);
    }
  }

  set onCommentAdd(fn) {
    this._onCommentSend = fn;
  }

  _onUndoClick() {
    const last = this._comments.slice(-1)[0];
    if (last.author === `user` && typeof this._onCommentDelete === `function`) {
      this._onCommentDelete();
      this._element.querySelector(`.film-details__watched-status`).innerHTML = `Comment deleted`;
    }
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  block() {
    this._element.querySelector(`.film-details__inner`).disabled = true;
  }
  unblock() {
    this._element.querySelector(`.film-details__inner`).disabled = false;
  }

  set onCommentDelete(fn) {
    this._onCommentDelete = fn;
  }

  _onScoreClick(evt) {
    this.userRating = evt.target.value;
    this._element.querySelector(`.film-details__user-rating`).innerHTML = `Your rate ${this.userRating}`;
  }

  _onEmojiClick(evt) {
    this._element.querySelector(`.film-details__add-emoji-label`).innerHTML = getEmoji(evt.target.value);
  }

  _onStatusClick(evt) {
    const field = {
      favorite: `isFavourite`,
      watched: `isWatched`,
      toWatchlist: `inWatchlist`}[evt.target.id];

    if (field) {
      this[field] = !this[field];
    }
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseClick.bind(this));
    this._element.querySelector(`.film-details__user-rating-score`).addEventListener(`change`, this._onScoreClick.bind(this));
    this._element.querySelector(`.film-details__controls`).addEventListener(`change`, this._onStatusClick.bind(this));
    document.addEventListener(`keydown`, this._onKeyPressed);
    this._element.querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onUndoClick.bind(this));
    this._element.querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._onEmojiClick.bind(this));
  }
}
