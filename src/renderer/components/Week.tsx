import { useState } from 'react';
import Weekday from './Weekday';

const { store } = window.electron;

interface AlarmTime {
  id: string;
  t: string;
  day: number;
}

const useElectronStore = <T,>(
  key: string,
  initialValue: T
): [T, (v: T) => void] => {
  const v = store.get(key);
  const [data, setData] = useState<T>(
    v === undefined ? initialValue : JSON.parse(v)
  );

  const setElectronValue = (value: T) => {
    const newvalstr = JSON.stringify(value);
    store.set(key, newvalstr);
    setData(JSON.parse(newvalstr));
  };

  return [data, setElectronValue];
};

const Week = () => {
  const [times, setTimes] = useElectronStore(`times`, {});
  if (typeof(times) !== 'object' || times instanceof Array) {
    setTimes({});
    return <div>plof</div>;
  }

  return (
    <div className="Week">
      <Weekday day={1} dayname="Monday" times={times} setTimes={setTimes} />
      <Weekday day={2} dayname="Tuesday" times={times} setTimes={setTimes} />
      <Weekday day={3} dayname="Wednesday" times={times} setTimes={setTimes} />
      <Weekday day={4} dayname="Thusday" times={times} setTimes={setTimes} />
      <Weekday day={5} dayname="Friday" times={times} setTimes={setTimes} />
      <Weekday day={6} dayname="Saturay" times={times} setTimes={setTimes} />
      <Weekday day={0} dayname="Sunday" times={times} setTimes={setTimes} />
    </div>
  );
};

export default Week;
