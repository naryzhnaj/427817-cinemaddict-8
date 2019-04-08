import Component from './component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

/**
 * @description сформировать список жанров
 *
 * @param {Array} data массив с фильмами
 *
 * @return {Object} list список
 */
const listGenres = (data) => {
  let list = {};

  data.forEach((film) => film.film_info.genre.forEach((el) => {
    list[el] = (list[el]) ? list[el] + 1 : 1;
  }));

  return list;
};

/**
 * @description подсчет времени просмотра
 *
 * @param {Array} data
 *
 * @return {Array} время с разбивкой на часы и минуты
 */
const countDuration = (data) => {
  const time = data.reduce((sum, film) => sum + film.film_info.runtime, 0);
  const minutes = time % 60;
  return [Math.floor(time / 60), (minutes > 9) ? minutes : `0${minutes}`];
};

export default class Stat extends Component {
  constructor(data, user) {
    super();
    this._data = data;
    this._films = data;
    this._genres = listGenres(data);
    this._duration = countDuration(data);
    this._user = user;
  }

  /**
   * @description поиск самого просматриваемого жанра
   *
   * @return {String} топовые жанры
   */
  _findTop() {
    const max = Math.max(...Object.values(this._genres));
    return Object.keys(this._genres).filter((el) => this._genres[el] === max).join(`, `);
  }

  /**
   * @description отрисовка диаграммы
   *
   * @return {Object}
   */
  _drawDiagram() {
    const statisticCtx = this._element.querySelector(`.statistic__chart`);
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * Object.keys(this._genres).length;

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this._genres),
        datasets: [{
          data: Object.values(this._genres),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  /**
   * @description шаблон для заголовка диаграммы
   *
   * @return {HTML}
   */
  _renderHeader() {
    return `<li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${this._films.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${this._duration[0]} <span class="statistic__item-description">h</span> ${this._duration[1]} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${this._findTop()}</p>
    </li>`;
  }

  get template() {
    const card = document.createElement(`section`);
    card.className = `statistic`;
    card.innerHTML = `<p class="statistic__rank">Your rank <span class="statistic__rank-label">${this._user}</span></p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">${this._renderHeader()}</ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>`;
    return card;
  }

  update(films) {
    this._films = films;
    this._genres = listGenres(films);
    this._duration = countDuration(films);
    this._element.querySelector(`.statistic__text-list`).innerHTML = this._renderHeader();
    this._drawDiagram();
  }

  _filterFilms() {
    const period = new FormData(this._element.querySelector(`.statistic__filters`)).get(`statistic-filter`);
    let films;
    switch (period) {
      case `all-time`:
        films = this._data;
        break;
      case `today`:
        films = this._data.filter((card) => card.user_details.watching_date >= moment().subtract(1, `day`).valueOf());
        break;
      default: films = this._data.filter((card) => card.user_details.watching_date >= moment().subtract(1, period).valueOf());
    }
    this.update(films);
  }

  bind() {
    this._element.querySelector(`.statistic__filters`).addEventListener(`change`, this._filterFilms.bind(this));
  }

  render() {
    this._element = this.template;
    this._drawDiagram();
    this.bind();
    return this._element;
  }
}
