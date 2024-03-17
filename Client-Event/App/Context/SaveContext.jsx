import React, { createContext, useState, useContext } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [savedEventUpdated, setSavedEventUpdated] = useState(false);
  const [createEventUpdate, setCreateEventUpdate] = useState(false);
  const [joinEventUpdate, setJoinEventUpdate] = useState(false);
  const [trendingEventUpdate, setTrendingEventUpdate] = useState(false);
  const [commentEventUpdate, setCommentEventUpdate] = useState(false);

  const updateSavedEvent = () => {
    setSavedEventUpdated(!savedEventUpdated);
  };
  const updateListEvent = () => {
    setCreateEventUpdate(!createEventUpdate);
  };
  const updateJoinEvent = () => {
    setJoinEventUpdate(!createEventUpdate);
  };
  const updateTrendingEvent = () => {
    setTrendingEventUpdate(!trendingEventUpdate);
  };
  const updateCommentEvent = () => {
    setCommentEventUpdate(!commentEventUpdate);
  };
  return (
    <EventContext.Provider
      value={{
        savedEventUpdated,
        updateSavedEvent,
        createEventUpdate,
        updateListEvent,
        joinEventUpdate,
        updateJoinEvent,
        trendingEventUpdate,
        updateTrendingEvent,
        commentEventUpdate,
        updateCommentEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
