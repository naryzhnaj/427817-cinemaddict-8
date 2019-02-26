/**
 * @description создать шаблон для фильтра
 *
 * @param {Object} filterItem данные фильтра
 * @param {Number} count соответствующее кол-во карточек
 *
 * @return {html} шаблонная строка
 */
export default (filterItem, count) =>
  `<a href="#${filterItem.name}"class="main-navigation__item">${filterItem.fullname} ${(filterItem.name !== `all`) ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`;
