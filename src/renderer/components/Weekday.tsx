import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Chip from './Chip';
import { TimeSelector } from './TimeSelector';

const { ipcRenderer } = window.electron;

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
    ipcRenderer.on('useElectronStore-answer', (_data: ElectronStoreMessage) => {
      if (key === _data.key) {
        const v = JSON.parse(_data.value);
        if (v !== data) setData(v);
      }
    });

    const r = ipcRenderer.sendMessageSync('useElectronStore-get', key);
    setData(r);
    /*
    window.electron.store.get(key).then((v:T) => {
      setData(v)
    });*/
  }, []);

  const setElectronValue = (value: T) => {
    ipcRenderer.sendMessage("useElectronStore-set", { key, value: JSON.stringify(value) })
    //window.electron.store.set(key, JSON.stringify(value))
  }
  return [ data, setElectronValue ]
}

const Weekday = (props:WeekdayProps) => {
  //const [ times, setTimes ] = useState<AlarmTime[]>([])
  const [ lastId, setLastId ] = useState<number>(0)
  const [ times, setTimes ] = useElectronStore<AlarmTime[]>("times", [])

  const addTime = () => {
    let id = lastId + 1
    setLastId(id)
    setTimes([...times, {id, t:"plop"} as AlarmTime ])
  }

  const removeTime = (id:number) => {
    setTimes([...times.filter(o => o.id !== id)])
  }

  useEffect(() => {
    //ipcRenderer.send('asynchronous-message', JSON.stringify(times))
  }, [times])

  return (
    <div className="Weekday">
      <div className="WeekDayName">{props.dayname}</div>
      <div className="WeekDayAlarms">
        {times.map((at:AlarmTime) =>
          <Chip
            key={"chip-"+at.id}
            onClose={(event) => { removeTime(at.id) }}
            type="input"
            className="mr-2"
          >
            <TimeSelector onChange={() => {}} hours={0} minutes={0}/>
          </Chip>
        )}
        <Button onClick={() => addTime()}>+</Button>
      </div>
    </div>
  )
}

export default Weekday
