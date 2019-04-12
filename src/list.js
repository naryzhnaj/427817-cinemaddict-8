import Film from './film.js';
import renderPopup from './popup-service.js';
import {updateStatus} from './filters-service.js';

const CARDS_AMOUNT = 5;

export default class List {
  constructor(data, parent, inMainBlock = true) {
    this._data = data;
    this._parent = parent;
    this._withControls = inMainBlock;
    this._activeList = `all`;
    this._renderedAmount = 0;
    this.isStock = true;
    this.filterBlock = null;
  }

  set setFilters(node) {
    this.filterBlock = node;
  }

  _clear() {
    this._renderedAmount = 0;
    this.isStock = true;
    const cards = this._parent.querySelectorAll(`.film-card`);
    cards.forEach((card) => {
      card.remove();
    });
  }

  filter(filterName = this._activeList) {
    let cards;
    switch (filterName) {
      case `all`:
        cards = this._data;
        break;
      case `watchlist`:
        cards = this._data.filter((card) => card.user_details.watchlist);
        break;
      case `history`:
        cards = this._data.filter((card) => card.user_details.already_watched);
        break;
      case `favorites`:
        cards = this._data.filter((card) => card.user_details.favorite);
        break;
      default:
        cards = this._data.filter((card) => filterName.test(card.film_info.title));
    }
    return cards;
  }

  changeFilter(filterName) {
    this._clear();
    this._activeList = filterName;
    this.render(this.filter(filterName));
  }

  render(data = this._data) {
    const cards = data.slice(this._renderedAmount, this._renderedAmount + CARDS_AMOUNT);
    cards.forEach((film) => {
      const filmCard = new Film(film, this._withControls);

      filmCard.onClick = () => renderPopup(film);

      filmCard.onAddToWatchList = () => {
        film.user_details.watchlist = !film.user_details.watchlist;
        updateStatus(`watchlist`, film.user_details.watchlist, this.filterBlock);
        if (this._activeList === `watchlist`) {
          filmCard.delete();
        }
      };

      filmCard.onMarkAsWatched = () => {
        film.user_details[`already_watched`] = !film.user_details[`already_watched`];
        updateStatus(`already_watched`, film.user_details[`already_watched`], this.filterBlock);
        if (this._activeList === `history`) {
          filmCard.delete();
        }
        if (film.user_details[`already_watched`]) {
          film.user_details[`watching_date`] = Date.now();
        }

      };

      filmCard.onMarkAsFavorite = () => {
        film.user_details.favorite = !film.user_details.favorite;
        updateStatus(`favorite`, film.user_details.favorite, this.filterBlock);
        if (this._activeList === `favorites`) {
          filmCard.delete();
        }
      };

      this._parent.appendChild(filmCard.render());
    });

    if (this._withControls) {
      this._renderedAmount += CARDS_AMOUNT;
      if (!cards || this._data.length <= this._renderedAmount) {
        this.isStock = false;
      }
    }
  }
}
