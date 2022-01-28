import { Fragment } from 'react';
import Head from 'next/head';

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
      <h1>Hello human</h1>
    </Fragment>
  );
}
