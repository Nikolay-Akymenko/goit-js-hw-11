export { fetchPhoto };
const axios = require('axios');
// получение коллекции изображений с бэкэнда по заданному фильтру и кол-ву изображений на одной странице
async function fetchPhoto(name, page, perPage) {
  try {
    const API_KEY = '30326053-2e350350678dcfd0e97e0fb0b';
    const standartFilter =
      '&orientation=horizontal&safesearch=true&image_type=photo';

    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${name}${standartFilter}&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    // обработка ошибки получения данных с бэкэнда
    console.error(error);
  }
}