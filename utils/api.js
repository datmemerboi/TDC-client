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

async function fetchAllInvoices() {
  let url, res, data = {}, error = {};
  try {
    url = process.env?.REACT_APP_ENVIRONMENT === "local"
      ? '/api/invoice/all'
      : config.API_URL + '/api/invoice/all';
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

async function printInvoice(invid) {
  let url, res, data = {}, error = {};
  try {
    url = process.env?.REACT_APP_ENVIRONMENT === "local"
      ? `/api/invoice/print/${invid}`
      : config.API_URL + `/api/invoice/print/${invid}`;
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

async function fetchAppointmentsByDate(start, end) {
  let url, res, data = {}, error = {};
  try {
    url = process.env?.REACT_APP_ENVIRONMENT === "local"
    ? `/api/appointment/all/?from=${start}&to=${end}`
    : config.API_URL + `/api/appointment/all/?from=${start}&to=${end}`
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
  fetchAllPatients,
  fetchAllInvoices,
  printInvoice,
  fetchAppointmentsByDate
};
