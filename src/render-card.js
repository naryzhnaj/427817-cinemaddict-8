/**
 * @description создать карточку фильма
 *
 * @param {Object} filmData атрибуты фильма
 * @param {Boolean} withDescription показывать описание
 *
 * @return {html} шаблонная строка
 */
export default (filmData, withDescription) =>
  `<article class="film-card${withDescription ? `` : ` film-card--no-controls`}">
    <h3 class="film-card__title">${filmData.title}</h3>
    <p class="film-card__rating">${filmData.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmData.year}</span>
      <span class="film-card__duration">${filmData.duration}</span>
      <span class="film-card__genre">${filmData.genre}</span>
    </p>
    <img src="./images/posters/${filmData.poster}.jpg" alt="" class="film-card__poster">
    ${withDescription ? `<p class="film-card__description">${filmData.description}</p>` : ``}
    <button class="film-card__comments">13 comments</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
  </article>`;
