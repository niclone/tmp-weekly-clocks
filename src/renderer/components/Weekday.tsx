import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid';
import Chip from './Chip';
import TimeSelector from './TimeSelector';

const { store } = window.electron;

interface WeekdayProps {
  day: number;
  dayname: string;
}

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

const Weekday = (props: WeekdayProps) => {
  const { day, dayname } = props;
  const [times, setTimes] = useElectronStore(`times`, {});
  if (typeof(times) !== 'object') {
    setTimes({});
    return <div>plof</div>;
  }
  const addTime = () => {
    const id = uuid();
    times[id] = { id, t: '00:00', day };
    setTimes(times);
  };

  const removeTime = (id: string) => {
    delete times[id];
    setTimes(times);
  };

  return (
    <div className="Weekday">
      <div className="WeekDayName">{dayname}</div>
      <div className="WeekDayAlarms">
        {Object.values(times)
          .filter((at: AlarmTime) => at.day === day)
          .map((at: AlarmTime) => (
            <Chip key={`chip-${at.id}`} onClose={() => removeTime(at.id)}>
              <TimeSelector
                onChange={(newtime: string) => {
                  at.t = newtime;
                  setTimes(times);
                }}
                timestr={at.t}
              />
            </Chip>
          ))}
        <Button onClick={() => addTime()}>+</Button>
      </div>
    </div>
  );
};

export default Weekday;
