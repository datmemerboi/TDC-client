import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import * as serviceWorker from './serviceWorker';

const App = lazy(() => import('./App')),
      NavBar = lazy(() => import('./components/navbar')),
      PatientIndex = lazy(() => import('./components/patient/index')),
      PatientForm = lazy(() => import('./components/patient/form')),
      PatientsTable = lazy(() => import('./components/patient/table')),
      PatientSearch = lazy(() => import('./components/patient/search')),
      PatientEdit = lazy(() => import('./components/patient/edit')),
      TreatmentIndex = lazy(() => import('./components/treatment/index')),
      TreatmentForm = lazy(() => import('./components/treatment/form')),
      TreatmentSearch = lazy(() => import('./components/treatment/search')),
      Calendar = lazy(() => import('./components/calendar/calendar')),
      Payment = lazy(() => import('./components/invoice/payment')),
      InvoiceIndex = lazy(() => import('./components/invoice/index'));


const pages = [
  { url: "/patient/form/", component: PatientForm },
  { url: "/patient/all/", component: PatientsTable },
  { url: "/patient/search/", component: PatientSearch },
  { url: "/patient/edit/", component: PatientEdit },
  { url: "/patient/", component: PatientIndex },
  { url: "/treatment/form/", component: TreatmentForm },
  { url: "/treatment/search/", component: TreatmentSearch },
  { url: "/treatment/", component: TreatmentIndex },
  { url: "/calendar/", component: Calendar },
  { url: "/invoice/payment/", component: Payment },
  { url: "/invoice/", component: InvoiceIndex },
  { url: "/", component: App }
]
render(
  <Suspense fallback={ <div/> }>
    <Router>
      <Switch>
        {
          pages.map((page, index) => <Route path={page.url} component={page.component} key={index} />)
        }
      </Switch>
      <NavBar />
    </Router>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
