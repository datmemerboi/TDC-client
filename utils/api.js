import debounce from 'lodash.debounce';

import config from '../config.json';

async function fetchAllPatients() {
  let url,
    res,
    data = {},
    error = {};
  try {
    // url = process.env.RUNNING_LOCALLY ? '/api/patient/all/' : config.API_URL + '/api/patient/all/';
    url = config.API_URL + '/api/patient/all/';
    console.log(process.env.RUNNING_LOCALLY, url);
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

async function createPatient(obj) {
  let url,
    res,
    data = {},
    error = {};
  try {
    url = config.API_URL + '/api/patient/new/';
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    };

    res = await fetch(url, options);
    switch (res.status) {
      case 201: {
        data = await res.json();
        break;
      }
      case 500: {
        error = { status: 500, message: 'Server Error occured! Try again.' };
        break;
      }
      default: {
        error = { status: res.status, message: 'Some error occured. Try again.' };
        break;
      }
    }
  } catch (e) {
    error = e;
  } finally {
    return { data, error };
  }
}

async function updatePatient(pid, obj) {
  let url,
    res,
    data = {},
    error = {};
  try {
    url = config.API_URL + `/api/patient/update/${pid}`;
    let options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    };

    res = await fetch(url, options);
    switch (res.status) {
      case 200: {
        data = await res.json();
        break;
      }
      case 500: {
        error = { status: 500, message: 'Server Error occured! Try again.' };
        break;
      }
      default: {
        error = { status: res.status, message: 'Some error occured. Try again.' };
        break;
      }
    }
  } catch (e) {
    error = e;
  } finally {
    return { data, error };
  }
}

async function getPatient(pid) {
  let url,
    res,
    data = {},
    error = {};
  try {
    url = config.API_URL + `/api/patient/get/${pid}`;
    res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
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

async function searchPatient(term, type) {
  let url,
    res,
    data = {},
    error = {};
  try {
    url = config.API_URL + `/api/patient/search/?term=${term}&type=${type}`;
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
    url = config.API_URL + '/api/invoice/all';
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
    url = config.API_URL + `/api/invoice/print/${invid}`;
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
    url = config.API_URL + `/api/appointment/all/?from=${start}&to=${end}`;
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
    url = config.API_URL + `/api/treatment/get/${tid}`;
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
    url = config.API_URL + `/api/invoice/new/`;
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
  createPatient,
  updatePatient,
  getPatient,
  searchPatient,
  fetchAllInvoices,
  printInvoice,
  fetchAppointmentsByDate,
  getTreatmentData,
  createInvoice
};
