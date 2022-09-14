import React from 'react'

interface TimeSelectorProps {
  onChange: object;
  hours: number;
  minutes: number;
};

export const TimeSelector = (props:TimeSelectorProps) => {
  return (
    <div className="row">
        <form>
            <input type="time" className="form-control" id="inputTime" aria-describedby="Alarme time" placeholder="Time"/>
        </form>
    </div>
  )
}

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
