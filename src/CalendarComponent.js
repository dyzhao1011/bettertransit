import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  // Format date to match dataset format (YYYY-MM-DD)
  const formatDate = (date) => {
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  // Update formattedDate whenever date changes
  useEffect(() => {
    if (selectedDate) {
      setFormattedDate(formatDate(selectedDate));
    }
  }, [selectedDate]);

  // Send date to backend
  useEffect(() => {
    if (formattedDate) {
      fetch("http://localhost:5000/api/save-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: formattedDate }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Date saved:", data))
        .catch((error) => console.error("Error saving date:", error));
    }
  }, [formattedDate]);

  return (
    <div className="calendar-wrapper">
      <h3>Select a Date</h3>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()} // Only allows today and future dates
        dateFormat="yyyy-MM-dd"
        inline // Full calendar display
      />

      {formattedDate && (
        <div className="selected-info">
          <h4>Selected Date:</h4>
          <p>{formattedDate}</p>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
