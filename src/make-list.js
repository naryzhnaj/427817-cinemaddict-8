const filmsData = new Map([
  [`release`, [`2008-07-08`, `2003-03-12`, `2007-05-01`, `2009-12-11`]],
  [`country`, [`USA`, `Italy`, `Canada`, `France`, `Germany`]],
  [`age`, [0, 6, 12, 18]],
  [`duration`, [60, 110, 120, 150, 180]],
  [`poster`, [`accused`, `blackmail`, `blue-blazes`, `fuga-da-new-york`, `moonrise`, `three-friends`]]]);

const randomText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.
Aliquam id orci ut lectus varius viverra.
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `);

const genres = [`Adventure`, `Comedy`, `Horror`, `Crime`, `Detective story`, `Fantasy`, `Drama`, `Romance`, `Thriller`, `Animation`];

/**
 * @description получить случайный элемент массива
 *
 * @param {Array} arr массив
 *
 * @return {String|Number} элемент массива
 */
const getRandomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * @description получить случайное число в диапазоне
 *
 * @param {Number} num максимум
 *
 * @return {Number} случайное число от 0 до num
 */
export const getRandomNumber = (num) => Math.floor(Math.random() * num);

/**
 * @description создать данные для случайного фильма
 *
 * @return {Object} film
*/
const makeFilm = () => {
  let film = {
    description: ``,
    genre: [],
    title: `movie № ${getRandomNumber(15) + 1}`,
    comments: [],
    director: `Brad Bird`,
    writer: `Brad Bird`,
    actors: `Samuel L. Jackson, Catherine Keener, Sophia Bush`,
    rating: [getRandomNumber(100) / 10],
    userRating: null,
    isFavourite: false,
    isWatched: false,
    inWatchlist: false
  };

  filmsData.forEach((value, key) => {
    film[key] = getRandomEl(value);
  });

  film.originalName = film.title;

  // добавить в описание от 1 до 3 случайных предложений из текста
  for (let i = 0; i < 1 + getRandomNumber(3); i++) {
    film.description += getRandomEl(randomText);
    film.genre.push(getRandomEl(genres));
    film.comments.push({
      text: getRandomEl(randomText),
      author: `user${i}`,
      date: `date${i}`
    });
  }

  return film;
};

/**
 * @description создать список произвольных фильмов
 *
 * @param {Number} num кол-во
 *
 * @return {Array}
 */
export default (num) => new Array(num).fill().map(makeFilm);
