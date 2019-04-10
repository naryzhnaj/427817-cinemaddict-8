const URL = `https://es8-demo-srv.appspot.com/moowle/movies`;
const StatusSuccess = {
  MIN: 200,
  MAX: 300};
const authorization = `Basic eo0w590ik29889a`;

/**
 * @description проверка статуса соединения
 *
 * @param {Object} response
 * @throw {Exception}
 * @return {Object} response
 */
const checkStatus = (response) => {
  if (response.status >= StatusSuccess.MIN && response.status < StatusSuccess.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/**
 * @description отрисовка сообщения об ошибке серверного соединения
 */
const onError = () => {
  const node = document.createElement(`div`);
  node.style = `width: 800px; margin: 20px auto; padding: 10px; text-align: center; background-color: yellow; color: black; font-size: 24px;`;
  node.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

/**
 * @description обмен данных с сервером
 *
 * @param {String} url
 * @param {String} method
 * @param {Object} body тело запроса
 *
 * @return {Function} callback
 */
const load = (url, method, body = null) => {
  let headers = new Headers({'Content-Type': `application/json`});
  headers.append(`Authorization`, authorization);

  return fetch(url, {method, body, headers}).then(checkStatus)
    .then((response) => response.json());
};

/**
 * @description загрузка данных с сервера
 *
 * @param {Function} fn callback в случае успеха
 *
 * @return {Function} callback
 */
export const getData = (fn) => load(URL, `GET`).then((data) => fn(data)).catch(onError);

/**
 * @description отправка данных на сервер
 *
 * @param {Object} data данные для отправки
 *
 * @return {Function} callback
 */
export const updateData = (data) => load(`${URL}/${data.id}`, `PUT`, JSON.stringify(data));
