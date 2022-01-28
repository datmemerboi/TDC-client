import { useState, Fragment } from 'react';
import Link from 'next/link';
import logo from '../public/logo.svg';
import Image from 'next/image';

export default function NavBar() {
  const [current, setCurrent] = useState(null);
  return (
    <Fragment>
      <nav>
        <Link href="/">
          <Image src={logo} alt="Logo" width={50} height={50} />
        </Link>
        <div className="nav-item-container">
          <div
            onMouseEnter={() => {
              setCurrent('Patient');
            }}
            onMouseLeave={() => {
              setCurrent(null);
            }}
          >
            <Link href="/patient">
              <a>
                <p className={current === 'Patient' ? 'Bld chosen-one' : 'Bld'}>Patients</p>
              </a>
            </Link>
          </div>
          <div
            onMouseEnter={() => {
              setCurrent('Treatment');
            }}
            onMouseLeave={() => {
              setCurrent(null);
            }}
          >
            <Link href="/treatment">
              <a>
                <p className={current === 'Treatment' ? 'Bld chosen-one' : 'Bld'}>Treatments</p>
              </a>
            </Link>
          </div>
          <div
            onMouseEnter={() => {
              setCurrent('Calendar');
            }}
            onMouseLeave={() => {
              setCurrent(null);
            }}
          >
            <Link href="/calendar">
              <a>
                <p className={current === 'Calendar' ? 'Bld chosen-one' : 'Bld'}>Calendar</p>
              </a>
            </Link>
          </div>
          <div
            onMouseEnter={() => {
              setCurrent('Invoice');
            }}
            onMouseLeave={() => {
              setCurrent(null);
            }}
          >
            <Link href="/invoice">
              <a>
                <p className={current === 'Invoice' ? 'Bld chosen-one' : 'Bld'}>Invoices</p>
              </a>
            </Link>
          </div>
        </div>
      </nav>
      <br />
    </Fragment>
  );
}
