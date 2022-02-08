import { Fragment } from 'react';
import Head from 'next/head';

import config from '../config.json';
import NavBar from '../components/navbar';

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>TDC</title>
        <link
          rel="preload"
          href="/fonts/ProximaNova/ProximaNova-Regular.woff2"
          as="font"
          type="font/woff2"
          crossorigin
        />
        <link
          rel="preload"
          href="/fonts/ProximaNova/ProximaNova-Semibold.woff2"
          as="font"
          type="font/woff2"
          crossorigin
        />
        <link
          rel="preload"
          href="/fonts/ProximaNova/ProximaNova-Bold.woff2"
          as="font"
          type="font/woff2"
          crossorigin
        />
        <link
          rel="preload"
          href="/fonts/ProximaNova/ProximaNova-Light.woff2"
          as="font"
          type="font/woff2"
          crossorigin
        />
      </Head>
      <header>
        <NavBar />
      </header>
      <div className="container">
        <div className="banner">
          <h1>
            The Patient Management system
            <br />
            for
          </h1>
          <h1>{config.CLINIC_NAME}</h1>
          <p>Please use the nav bar above to navigate to the respective pages</p>
        </div>
      </div>
    </Fragment>
  );
}
