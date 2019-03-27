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
      `<a href="#${filter.name}" id="${filter.name}" class="main-navigation__item">${filter.fullname}${(filter.name !== `all`) ? `<span class="main-navigation__item-count"></span>` : ``}</a>`)
      .join(``);

    nav.innerHTML += `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`;
    return nav;
  }

  set onFilterChange(fn) {
    this._onFilterChange = fn;
  }

  update(filtername, num) {
    this._element.querySelector(`#${filtername} .main-navigation__item-count`).textContent = num;
  }

  set onStatOpen(fn) {
    this._onStatOpen = fn;
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterChange.bind(this));
    this._element.querySelector(`.main-navigation__item--additional`).addEventListener(`click`, this._onStatOpen.bind(this));
  }
}
