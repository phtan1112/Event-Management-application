package com.duan.server.Services;


import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.StatusDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Response.ResponseEvent;
import jakarta.annotation.Nullable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IEventService {
    EventDTO persistEvent( MultipartFile[] images,
                           String title,
                           String typeOfEvent,
                           LocalDate date_start,
                           LocalTime time_start,
                           LocalTime time_end,
                           String description,
                           String place, Double latitude, Double longitude);

    EventDTO findById(int id);
    StatusDTO findStatusByEvent(int idEvent);
    List<ResponseEvent> FindAllEventByUser();
    ResponseEvent findDetailEventByUserAndEventId(int id);
    Boolean cancelEvent( int id);
    Boolean permitEvent(int id);
    ResponseEvent changeStatusEventById(int idEvent, Map<Object, Object> fields);
    ResponseEvent changeAnyDataOfEvent(int idEvent, Map<Object, Object> fields);
    ResponseEvent uploadImage(MultipartFile[] images,int idEvent);
    List<ResponseEvent> getAllEvents();
    List<EventDTO> getAllEventsByStatusEndedIsFalse();
    boolean changeStatusEventByIdEventForSchedule(EventDTO eventDTO, Map<Object, Object> fields);
    List<ResponseEvent> filterByCategory(String typeOfEvent);
    List<ResponseEvent> filterByCategoryAndTitle(String typeOfEvent,String title);
    List<ResponseEvent> filterByTitleContaining(String title);


    ResponseEvent addUserToListOfParticipation(int idEvent, String email);
    Boolean checkUserIsInParticipatorsOrNot(UserDTO userDTO, Set<UserDTO> participators);

    void calculateStarOfEvent(int idEvent);
    List<ResponseEvent> viewEventByUserAndStatus(Integer statusCode,
                                                 Integer starStart,Integer starEnd,
                                                 Integer typeOfDate,
                                                 LocalDate dateStart, LocalDate dateEnd);
}
