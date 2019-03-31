import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    const nav = document.createElement(`nav`);
    nav.className = `main-navigation`;

    nav.innerHTML = this._data.map((filter) =>
      `<a href="#${filter.name}" id="${filter.name}" class="main-navigation__item${(filter.name === `all`) ? ` main-navigation__item--active` : ``}">
      ${filter.fullname}${(filter.name !== `all`) ? `<span class="main-navigation__item-count"></span>` : ``}</a>`)
      .join(``);

    nav.innerHTML += `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`;
    return nav;
  }

  set onFilterChange(fn) {
    this._onFilterClick = fn;
  }

  _onFilterChange(evt) {
    evt.preventDefault();
    const name = evt.target.id;

    if (name && typeof this._onFilterClick === `function`) {
      this._element.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
      this._onFilterClick(name);
    }
  }

  update(filtername, num) {
    this._element.querySelector(`#${filtername} .main-navigation__item-count`).textContent = num;
  }

  set onStatOpen(fn) {
    this._onStat = fn;
  }

  _onStatOpen() {
    if (typeof this._onStat === `function`) {
      this._onStat();
    }
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterChange.bind(this));
    this._element.querySelector(`.main-navigation__item--additional`).addEventListener(`click`, this._onStatOpen.bind(this));
  }
}
