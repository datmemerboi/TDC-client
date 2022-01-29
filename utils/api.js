import config from '../config.json';

async function fetchAllPatients() {
  let url,
    res,
    data = {},
    error = {};
  try {
    url =
      process.env?.REACT_APP_ENVIRONMENT === 'local'
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
  let url,
    res,
    data = {},
    error = {};
  try {
    url =
      process.env?.REACT_APP_ENVIRONMENT === 'local'
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
  let url,
    res,
    data = {},
    error = {};
  try {
    url =
      process.env?.REACT_APP_ENVIRONMENT === 'local'
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
  let url,
    res,
    data = {},
    error = {};
  try {
    url =
      process.env?.REACT_APP_ENVIRONMENT === 'local'
        ? `/api/appointment/all/?from=${start}&to=${end}`
        : config.API_URL + `/api/appointment/all/?from=${start}&to=${end}`;
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

async function getTreatmentData(tid) {
  let url,
    res,
    data = {},
    error = {};
  try {
    url =
      process.env?.REACT_APP_ENVIRONMENT === 'local'
        ? `/api/treatment/get/${tid}`
        : config.API_URL + `/api/treatment/get/${tid}`;
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

async function createInvoice(invoiceObj) {
  let url,
    res,
    data = {},
    error = {};
  try {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceObj)
    };
    url =
      process.env?.REACT_APP_ENVIRONMENT === 'local'
        ? `/api/invoice/new/`
        : config.API_URL + `/api/invoice/new/`;

    res = await fetch(url, options);
    if (res.status === 201) {
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
  fetchAppointmentsByDate,
  getTreatmentData,
  createInvoice
};
