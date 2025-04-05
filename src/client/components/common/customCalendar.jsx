import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

function CustomCalendar({holidays, onChangeCallback, selectedDate}) {
  const [value, onChange] = useState(selectedDate);
  const minDate = new Date();

  useEffect(() => {
    console.log("holidays>>>>>>>>>>", holidays)
  }, [holidays])

  const handelDisabled = ({ activeStartDate, date, view }) => {
    // console.log(date, date.getTime())
    if (holidays && holidays.length && holidays.includes(date.getTime())) {
      // console.log("extry true for holiday match")
      return true;
    } else {
      return false;
    }
    // console.log("activeStartDate: ", activeStartDate)
    // console.log("date: ", activeStartDate)
    // console.log("view: ", view)
  }

  const dateFormatChange = (value) => {
    let date = new Date(value);
    console.log("date", value)
    return new Date(date.setHours(0,0,0,0));
  }

  return (
    <>
      <Calendar onClickDay={(v) => onChangeCallback(v)} onChange={(v, e) => {onChange(v)}} value={value} minDate={minDate} tileDisabled={(args) => handelDisabled(args)}/>
    </>
  );
}

export default CustomCalendar;
