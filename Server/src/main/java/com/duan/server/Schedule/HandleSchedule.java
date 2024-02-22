package com.duan.server.Schedule;

import com.duan.server.DTO.EventDTO;
import com.duan.server.Services.Implement.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@EnableAsync
public class HandleSchedule {
    @Autowired
    private EventService eventService;


    @Async
    @Scheduled(fixedRate = 5000)
    public void scheduleFixedRateTaskAsync() throws InterruptedException {
        List<EventDTO> allEvents = eventService.getAllEventsByStatusEndedIsFalse();
        LocalDate currentDate = LocalDate.now(); //2024-02-13
        LocalTime currentTime = LocalTime.now(); // 14:24:32.699555900

        for (EventDTO eventDTO : allEvents) {

            LocalDate TARGET_DATE_START = LocalDate.of(
                    eventDTO.getDate_start().getYear(),
                    eventDTO.getDate_start().getMonth(),
                    eventDTO.getDate_start().getDayOfMonth());

            LocalTime TARGET_TIME_START = LocalTime.of(
                    eventDTO.getTime_start().getHour(),
                    eventDTO.getTime_start().getMinute());

            LocalTime TARGET_TIME_END = LocalTime.of(
                    eventDTO.getTime_end().getHour(),
                    eventDTO.getTime_end().getMinute());

            if (currentDate.isEqual(TARGET_DATE_START)) { // event da toi ngay
                //handle changing from created to operating
                if (!eventService.findStatusByEvent(eventDTO.getId()).getOperating()
                        &&
                        currentTime.isAfter(TARGET_TIME_START)) {

                    Map<Object, Object> fields = new HashMap<>();
                    fields.put("operating", true);
                    eventService.changeStatusEventByIdEventForSchedule(eventDTO, fields);
                }
                //handle changing from operating to ended
                if (currentTime.isAfter(TARGET_TIME_END)) {
                    Map<Object, Object> fields = new HashMap<>();
                    fields.put("ended", true);
                    eventService.changeStatusEventByIdEventForSchedule(eventDTO, fields);
                }
            }
        }
        Thread.sleep(2000);
    }
}
