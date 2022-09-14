import Weekday from './Weekday';

const Week = () => {
  return (
    <div className="Week">
      <Weekday dayname="Monday" />
      <Weekday dayname="Tuesday" />
      <Weekday dayname="Wednesday" />
      <Weekday dayname="Thusday" />
      <Weekday dayname="Friday" />
      <Weekday dayname="Saturay" />
      <Weekday dayname="Sunday" />
    </div>
  );
};

export default Week;
