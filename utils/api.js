import config from '../config.json';

async function fetchAllPatients() {
  let url, res, data = {}, error = {};
  try {
    url = process.env?.REACT_APP_ENVIRONMENT === "local"
      ? '/api/patient/all/'
      : config.API_URL + '/api/patient/all/';
    res = await fetch(url);
    if (res.status === 200) {
      data = await res.json();
    } else {
      error = res;
    }
  } catch (e) {
    error = e;
  } finally {
    return { data, error };
  }
}

export default {
  fetchAllPatients
};
