import Weekday from './Weekday';

const Week = () => {
  return (
    <div className="Week">
      <Weekday day={1} dayname="Monday" />
      <Weekday day={2} dayname="Tuesday" />
      <Weekday day={3} dayname="Wednesday" />
      <Weekday day={4} dayname="Thusday" />
      <Weekday day={5} dayname="Friday" />
      <Weekday day={6} dayname="Saturay" />
      <Weekday day={0} dayname="Sunday" />
    </div>
  );
};

export default Week;
