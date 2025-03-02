import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="calendar-wrapper">
      <h3>Select a Date</h3>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()} // Only allows today and future dates
        inline // Full calendar display
      />
    </div>
  );
}

export default CalendarComponent;
