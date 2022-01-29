import { Fragment } from 'react';
import Link from 'next/link';
import NavBar from '../../components/navbar';

export default function () {
  return (
    <Fragment>
      <header><NavBar /></header>
      <div className="container">
        <h2>Treatment pages</h2>
        <ul>
          <li><Link href="/treatment/form/"><a>New Treatment</a></Link></li>
          <li><Link href="/treatment/search/"><a>Search Treatment</a></Link></li>
        </ul>
      </div>
    </Fragment>
  );
}
