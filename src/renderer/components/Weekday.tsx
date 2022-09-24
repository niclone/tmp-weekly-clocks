import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid';
import Chip from './Chip';
import TimeSelector from './TimeSelector';

interface WeekdayProps {
  day: number;
  dayname: string;
  times: object;
  setTimes: (o: object) => void;
}

const Weekday = (props: WeekdayProps) => {
  const { day, dayname, times, setTimes } = props;

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
