import Component from './component.js';

export default class Film extends Component {
  constructor(data, withDescription) {
    super();
    this._title = data.title;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._poster = data.poster;
    this._description = data.description;
    this._rating = data.rating;

    this._data = data;
    this._withDescription = withDescription;
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
        <span class="film-card__year">${this._year}</span>
        <span class="film-card__duration">${this._duration}</span>
        <span class="film-card__genre">${this._genre.join(`, `)}</span>
      </p>
      <img src="./images/posters/${this._poster}.jpg" alt="" class="film-card__poster">
      ${this._withDescription ? `<p class="film-card__description">${this._description}</p>` : ``}
      <button class="film-card__comments">comments</button>

      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>`;
    return card;
  }

  set onCommentsClick(fn) {
    this._onCommentsClick = fn;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onCommentsClick.bind(this));
  }
}
