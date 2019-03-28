const URL = `https://es8-demo-srv.appspot.com/moowle/movies`;
const SUCCESS_STATUS = 200;
const authorization = `Basic eo0w590ik29889a`;

const checkStatus = (response) => {
  if (response.status >= SUCCESS_STATUS && response.status < SUCCESS_STATUS + 100) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const onError = () => {
  const node = document.createElement(`div`);
  node.style = `width: 400px; margin: 0 auto; text-align: center; background-color: red;`;
  node.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

/**
 * @description загрузка данных с сервера
 *
 * @param {Function} fn callback в случае успеха
 *
 * @return {Function} callback
 */
export const getData = (fn) => {
  let headers = new Headers();
  headers.append(`Authorization`, authorization);

  return fetch(URL, {method: `GET`, body: null, headers}).then(checkStatus)
    .then((response) => response.json()).then((data) => fn(data)).catch(onError);
};
