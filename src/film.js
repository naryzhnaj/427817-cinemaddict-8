import Component from './component.js';

export default class Film extends Component {
  constructor(data, withDescription) {
    super();
    this._title = data.film_info.title;
    this._release = new Date(data.film_info.release.date).getFullYear();
    this._duration = data.film_info.runtime;
    this._genre = data.film_info.genre;
    this._poster = data.film_info.poster;
    this._description = data.film_info.description;
    this._rating = data.film_info.total_rating;
    this._commentsNumber = data.comments.length;
    this._withDescription = withDescription;
  }

  get minutesFormated() {
    return `${Math.floor(this._duration / 60)}:${this._duration % 60}`;
  }

  get template() {
    const card = document.createElement(`article`);
    card.className = `film-card`;
    if (this._withDescription) {
      card.classList.add(`film-card--no-controls`);
    }

    card.innerHTML = `<h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${this._release}</span>
        <span class="film-card__duration">${this.minutesFormated}</span>
        <span class="film-card__genre">${this._genre.join(`, `)}</span>
      </p>
      <img src="${this._poster}" alt="" class="film-card__poster">
      ${this._withDescription ? `<p class="film-card__description">${this._description}</p>` : ``}
      <button class="film-card__comments">${(this._commentsNumber === 1) ? `1 comment` : `${this._commentsNumber} comments`}</button>

      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>`;
    return card;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onStatusClick(fn) {
    this._onStatusClick = fn;
  }

  _onAddToWatchList(evt) {
    evt.preventDefault();
    return typeof this._onStatusClick === `function` && this._onStatusClick(`watchlist`);
  }

  _onMarkAsWatched(evt) {
    evt.preventDefault();
    return typeof this._onStatusClick === `function` && this._onStatusClick(`already_watched`);
  }

  _onMarkAsFavorite(evt) {
    evt.preventDefault();
    return typeof this._onStatusClick === `function` && this._onStatusClick(`favorite`);
  }

  bind() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onClick.bind(this));
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onAddToWatchList.bind(this));
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onMarkAsWatched.bind(this));
    this._element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onMarkAsFavorite.bind(this));
  }
}
