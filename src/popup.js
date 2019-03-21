import Component from './component.js';
import moment from 'moment';

export default class Popup extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._original = data.originalName;
    this._release = moment(data.release).format(`D MMMM YYYY`);
    this._duration = data.duration;
    this._genre = data.genre;
    this._poster = data.poster;
    this._description = data.description;
    this._rating = data.rating;
    this._country = data.country;
    this._age = data.age;
    this._director = data.director;
    this._writer = data.writer;
    this._actors = data.actors;
    this._comments = data.comments;
    this._userRating = data.userRating;

    this.isFavourite = data.isFavourite;
    this.isWatched = data.isWatched;
    this.inWatchlist = data.inWatchlist;
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
        <img class="film-details__poster-img" src="images/posters/${this._poster}.jpg" alt=${this._title}>
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
            <p class="film-details__user-rating">Your rate ${this._userRating ? this._userRating : ``}</p>
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

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="to_watchlist"
        ${this.inWatchlist ? `checked` : ``} name="to_watchlist">
      <label for="to_watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched"
        ${this.isWatched ? `checked` : ``} name="watched">
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite"
        ${this.isFavourite ? `checked` : ``} name="favorite">
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>

    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${this._comments.map((comment) =>
    `<li class="film-details__comment">
            <span class="film-details__comment-emoji">😴</span>
            <div>
              <p class="film-details__comment-text">${comment.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${moment(comment.date).format(`D MMM YYYY`)}</span>
              </p>
            </div>
          </li>`).join(``)}
      </ul>

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
        <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
        <button class="film-details__watched-reset" type="button">undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="images/posters/${this._poster}.jpg" alt="film-poster" class="film-details__user-rating-img">
      </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._title}</h3>
          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
  ${new Array(9).fill().map((val, i)=> 1 + i).map((i) =>
    `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value=${i} id="rating-${i}">
            <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`).join(``)}
          </div>
        </section>
      </div>
    </section>
  </form>`;
    return popup;
  }

  _onCloseClick() {
    this._element.remove();
  }

  _onScoreClick(evt) {
    this._userRating = evt.target.value;
    this._element.querySelector(`.film-details__user-rating`).innerHTML = `Your rate ${this._userRating}`;
  }

  _onStatusClick(evt) {
    const field = {
      favorite: `isFavourite`,
      watched: `isWatched`,
      to_watchlist: `inWatchlist`}[evt.target.id];

    if (field) {
      this[field] = !this[field];
    }
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseClick.bind(this));
    this._element.querySelector(`.film-details__user-rating-score`).addEventListener(`change`, this._onScoreClick.bind(this));
    this._element.querySelector(`.film-details__controls`).addEventListener(`change`, this._onStatusClick.bind(this));
    // this._element.addEventListener(`keydown`, this._onCommentAdd.bind(this));
  }
}
