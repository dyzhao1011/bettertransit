import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent({selectedDate, setSelectedDate}) {
  return (
    <div className="calendar-wrapper">
      <h3>Select a Date</h3>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date.toISOString().split('T')[0])}
        minDate={new Date()} // Only allows today and future dates
        dateFormat="yyyy-MM-dd"
        inline // Full calendar display
      />

      {selectedDate && (
        <div className="selected-info">
          <h4>Selected Date:</h4>
          <p>{selectedDate}</p>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
