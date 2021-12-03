const url = `http://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2019-01-01&primary_release_date.lte=2019-12-31`;
const apiKey = process.env.APIKey;

export { url, apiKey };
