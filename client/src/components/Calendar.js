import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";
import AddEventModal from "./AddEventModal";
import { useRef } from "react";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Calendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const calendarRef = useRef(null);

  const onEventAdded = (event) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      title: event.title,
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
    });
  };

  async function handleEventAdd(data) {
    try {
      await axios.post("/api/calendar/create-event", data.event);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDatesSet(data) {
    try {
      const response = await axios.get(
        "/api/calendar/get-events?start=" +
        moment(data.start).toISOString() +
        "&end=" +
        moment(data.end).toISOString()
      );
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  setInterval(() => {
    const threshold = 1000; // 1 minutes in milliseconds
    events.forEach(event => {
      let currentDate = new Date().toISOString();
      let eventStartDate = new Date(event.start).toISOString();

      // Check if the current date is within the threshold of the event's start date
      if (Math.abs(new Date(currentDate) - new Date(eventStartDate)) < threshold) {
        toast(event.title + " is starting now!!");
      }
    });
  }, 1000);

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !(prevRefresh));
  }

  return (
    <section>
      <ToastContainer />
      <button onClick={() => setModalOpen(true)}>Add Event</button>

      <div style={{ position: "relative", zIndex: 0 }}>
        <FullCalendar
          key={refresh ? "refreshKey" : "normalKey"}
          ref={calendarRef}
          events={events}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          eventAdd={handleEventAdd}
          datesSet={handleDatesSet}
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={(event) => onEventAdded(event)}
        onRefresh={handleRefresh}
      />
    </section>
  );
}

export default Calendar;
