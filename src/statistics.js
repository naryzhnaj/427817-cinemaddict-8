import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

/**
 * @description подсчет времени просмотра
 *
 * @param {Array} data массив с фильмами
 *
 * @return {Array} время с разбивкой на часы и минуты
 */
const countDuration = (data) => {
  const time = data.reduce((sum, film) => sum + film.duration, 0);
  return [Math.floor(time / 60), time % 60];
};

/**
 * @description отрисовка диаграммы
 *
 * @param {Object} genres жанры
 */
const drawDiagram = (genres) => {
  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * Object.keys(genres).length;

  new Chart(statisticCtx, { // eslint-disable-line no-new
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(genres),
      datasets: [{
        data: Object.values(genres),
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
};

/**
 * @description сформировать список жанров
 *
 * @param {Array} data массив с фильмами
 *
 * @return {Object} list список
 */
const listGenres = (data) => {
  let list = {};

  data.forEach((film) => film.genre.forEach((el) => {
    list[el] = (list[el]) ? list[el] + 1 : 1;
  }));

  return list;
};

/**
 * @description шаблон блока
 *
 * @param {Number} count число фильмов
 * @param {Array} time продолжительность просмотра
 * @param {String} userStatus статус пользователя
 * @param {String} topGenre популярный жанр
 *
 * @return {html} шаблонная строка
 */
const drawStat = (count, time, userStatus, topGenre) =>
  `<p class="statistic__rank">Your rank <span class="statistic__rank-label">${userStatus}</span></p>
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters visually-hidden">
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

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${count} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${time[0]} <span class="statistic__item-description">h</span> ${time[1]} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>`;

/**
 * @description поиск самого просматриваемого жанра
 *
 * @param {Array} data массив с фильмами
 *
 * @return {String} топовые жанры
 */
const findTop = (data) => {
  const max = Math.max(...Object.values(data));
  return Object.keys(data).filter((el) => data[el] === max).join(`, `);
};

/**
 * @description главная ф-ия для работы со статистикой
 *
 * @param {Array} films массив с фильмами
 * @param {String} userStatus статус пользователя
 */
export default (films, userStatus) => {
  const genres = listGenres(films);
  const time = countDuration(films);
  document.querySelector(`.statistic`).innerHTML = drawStat(films.length, time, userStatus, findTop(genres));
  drawDiagram(genres);
};
