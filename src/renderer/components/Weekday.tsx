import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Chip from './Chip';
import { TimeSelector } from './TimeSelector';

const { store } = window.electron;

interface WeekdayProps {
  dayname: string;
}

interface AlarmTime {
  id: number;
  t: string;
}

interface ElectronStoreMessage {
  key: string;
  value: string;
}

const useElectronStore = <T,>(
  key: string,
  initialValue: T
): [T, (v: T) => void] => {
  const [data, setData] = useState<T>(initialValue);
  useEffect(() => {
    /*
    ipcRenderer.on('useElectronStore-answer', (_data: ElectronStoreMessage) => {
      if (key === _data.key) {
        const v = JSON.parse(_data.value);
        if (v !== data) setData(v);
      }
    });
    */

    const r = store.get(key);
    if (r === undefined) setData(initialValue);
    else setData(JSON.parse(r));

    /*
    window.electron.store.get(key).then((v:T) => {
      setData(v)
    }); */
  }, [key]);

  const setElectronValue = (value: T) => {
    store.set(key, JSON.stringify(value));
    setData(value);
  };

  return [data, setElectronValue];
};

const Weekday = (props:WeekdayProps) => {
  //const [ times, setTimes ] = useState<AlarmTime[]>([])
  const [ lastId, setLastId ] = useState<number>(0);
  const [ times, setTimes ] = useElectronStore<AlarmTime[]>("times", []);

  const addTime = () => {
    let id = lastId + 1;
    setLastId(id);
    setTimes([...times, {id, t:"plop"} as AlarmTime ]);
  };

  const removeTime = (id:number) => {
    setTimes([...times.filter(o => o.id !== id)])
  };

  return (
    <div className="Weekday">
      <div className="WeekDayName">{props.dayname}</div>
      <div className="WeekDayAlarms">
        {times.map((at:AlarmTime) =>
          <Chip
            key={`chip-${at.id}`}
            onClose={() => removeTime(at.id)}
            type="input"
            className="mr-2"
          >
            <TimeSelector onChange={() => {}} hours={0} minutes={0}/>
          </Chip>
        )}
        <Button onClick={() => addTime()}>+</Button>
      </div>
    </div>
  );
};

export default Weekday;
