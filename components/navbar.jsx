import Link from 'next/link';
import Image from 'next/image';

import logo from '../public/logo.svg';

export default function NavBar() {
  /**
   * Component to render the navigation bar on any page
   *
   * @version 1.2.2
   */
  return (
    <nav>
      <div className="image-container">
        <Link href="/">
          <a>
            <Image src={logo} alt="Logo" width={50} height={50} />
          </a>
        </Link>
      </div>
      <div className="link-container">
        <div>
          <Link href="/patient">
            <a>
              <p className="Bld">Patients</p>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/treatment">
            <a>
              <p className="Bld">Treatments</p>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/invoice">
            <a>
              <p className="Bld">Invoice</p>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/calendar">
            <a>
              <p className="Bld">Calendar</p>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/management">
            <a>
              <p className="Bld">Management</p>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
