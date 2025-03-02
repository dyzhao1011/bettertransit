import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  // Generate available time slots (1-hour intervals)
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = new Date();
      time.setHours(hour, 0, 0, 0);
      times.push(time);
    }
    return times;
  };

  // Update selectedDateTime whenever date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(selectedTime.getHours(), 0, 0, 0);
      setSelectedDateTime(newDateTime);
    }
  }, [selectedDate, selectedTime]);

  return (
    <div className="calendar-wrapper">
      <h3>Select a Date</h3>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()} // Only allows today and future dates
        inline // Full calendar display
      />

      <h3>Select a Time</h3>
      <select
        className="time-selector"
        value={selectedTime ? selectedTime.toISOString() : ""}
        onChange={(e) => setSelectedTime(new Date(e.target.value))}
      >
        <option value="" disabled>Select a time</option>
        {generateTimeSlots().map((time, index) => (
          <option key={index} value={time.toISOString()}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
          </option>
        ))}
      </select>

      {selectedDateTime && (
        <div className="selected-info">
          <h4>Selected Date and Time:</h4>
          <p>{selectedDateTime.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
