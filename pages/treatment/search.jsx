import { Fragment, useState, useEffect } from 'react';

import api from '../../utils/api';
import { TreatmentCard } from '../../components/card';
import { PaySlip } from '../../components/payment';
import NavBar from '../../components/navbar';

// &#x2A2F;

export default function TreatmentSearch() {
  /**
   * Page to search through treatments by Patient ID or Treatment ID
   *
   * @version 1.2.2
   * @route /treatment/search
   */
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('PID');
  const [result, setResult] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(async () => {
    if (keyword && type) {
      let { data } = await api.searchTreatment(keyword, type); // Make search request
      if (Object.keys(data).length) {
        // Set Results
        if (data.docs && data.docs.length) {
          return setResult(data.docs);
        }
        return setResult([data]);
      }
    }
  }, [keyword, type]);

  const handleInput = (e) => {
    setKeyword(e.target.value.toUpperCase());
  };
  const addItem = (value) => {
    if (selectedList.length < 4 && !selectedList.includes(value)) {
      setSelectedList([...selectedList, value]);
    }
  };

  return (
    <Fragment>
      <NavBar />
      <div className="container">
        <div className="center-of-page">
          <input
            type="text"
            className="input-bar"
            name="keyword"
            onInput={handleInput}
            placeholder="Search"
          />
          <br style={{ userSelect: 'none' }} />
          <table>
            <tbody>
              <tr>
                <td className={type === 'PID' ? 'chosen-one' : null} onClick={() => setType('PID')}>
                  Patient ID
                </td>
                <td className={type === 'TID' ? 'chosen-one' : null} onClick={() => setType('TID')}>
                  Treatment ID
                </td>
              </tr>
            </tbody>
          </table>
          {result && result.length ? (
            <div className="scrollable short-scrollable">
              {result.map((obj, i) => (
                <TreatmentCard
                  obj={obj}
                  key={i}
                  clickable={selectedList.length < 4}
                  handleClick={addItem}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ position: 'relative', top: '5vmin' }}>
        <PaySlip list={selectedList} />
      </div>
    </Fragment>
  );
}
