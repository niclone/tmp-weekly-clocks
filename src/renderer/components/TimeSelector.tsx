import React from 'react';

interface TimeSelectorProps {
  onChange: (t: string) => void;
  timestr: string;
}

export default (props: TimeSelectorProps) => {
  const { onChange, timestr } = props;
  return (
    <div className="row">
      <form>
        <input
          type="time"
          className="form-control"
          id="inputTime"
          aria-describedby="Alarme time"
          placeholder="Time"
          onChange={(event) => { console.log("paf", event.target.value); onChange(event.target.value); }}
          value={timestr}
        />
      </form>
    </div>
  );
};

/*
export const TimeSelector = (props:TimeSelectorProps) => {
  return (
    <div className="row">
        <DropdownButton className="col-sm" id="dropdown-basic-button1" title={props.hours}>
            {Array(60).fill(0).map((_,i) => <Dropdown.Item key={'plop-'+i} href={'#/plop'+i}>{i}</Dropdown.Item>)}
        </DropdownButton>
        <div className="col-sm">:</div>
        <DropdownButton className="col-sm" id="dropdown-basic-button2" title={props.minutes}>
            {Array(60).fill(0).map((_,i) => <Dropdown.Item key={'plop-'+i} href={'#/plop'+i}>{i}</Dropdown.Item>)}
        </DropdownButton>
    </div>
  )
}
*/
