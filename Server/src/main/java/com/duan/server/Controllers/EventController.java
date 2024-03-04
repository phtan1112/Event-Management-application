package com.duan.server.Controllers;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.StatusDTO;
import com.duan.server.Request.ParticipatorEventRequest;
import com.duan.server.Response.*;
import com.duan.server.Response.ResponseStatus;
import com.duan.server.Services.Implement.EventService;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/v1/event")
@Transactional
public class EventController {
    @Autowired
    private EventService eventService;


    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestPart("images") MultipartFile[] images,
                                         @RequestParam("title") String title,
                                         @RequestParam("typeEvent") String typeOfEvent,
                                         @RequestParam("dateStart") LocalDate date_start,
                                         @RequestParam("timeStart") LocalTime time_start,
                                         @RequestParam("timeEnd") LocalTime time_end,
                                         @RequestParam("description") String description,
                                         @RequestParam("place") String place,
                                         @RequestParam("latitude") Double latitude,
                                         @RequestParam("longitude") Double longitude
    ) {


        EventDTO eventDTO = eventService.persistEvent(
                images,
                title,
                typeOfEvent,
                date_start,
                time_start,
                time_end,
                description,
                place, latitude, longitude);
        if (eventDTO != null) {
            return new ResponseEntity<>(
                    ResponseObject
                            .builder()
                            .code(0)
                            .message("create event successful")
                            .object(eventDTO)
                            .build(), HttpStatus.OK);
        } else {
            CodeAndMessage cm = new CodeAndMessage();
            cm.setCode(1);
            cm.setMessage("Fail to create event!!");
            return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/status/{idEvent}") //id of event
    public ResponseEntity<?> getStatusOfEvent(@PathVariable("idEvent") Integer idEvent) {

        try {
            StatusDTO statusDTO = eventService.findStatusByEvent(idEvent);
            if (statusDTO != null) {

                return new ResponseEntity<>(ResponseStatus
                        .builder()
                        .created(statusDTO.getCreated())
                        .operating(statusDTO.getOperating())
                        .ended(statusDTO.getEnded())
                        .build(), HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Do not find status of event by id =" + idEvent);
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @GetMapping("/all-event-user") //get all event created user
    public ResponseEntity<?> getAllEventOfUser() {
        try {
            List<ResponseEvent> listEventDto = eventService.FindAllEventByUser();
            if (listEventDto.size() > 0) {
                return new ResponseEntity<>(listEventDto, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Do not find all event by user caused email is not valid or not correct authorization!!");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all-events")
    public ResponseEntity<?> responseAllEvents(
            @RequestParam("email") String email,
            @Nullable @RequestParam("statusCode") Integer codeEnd
    ) {
        try {
            List<ResponseEvent> lstDto = eventService.getAllEvents(email,codeEnd);
            if (!lstDto.isEmpty()) {
                return new ResponseEntity<>(lstDto, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("There are no events available");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/detail/{idEvent}") //id of event, get event of this user created
    public ResponseEntity<?> getDetailEventByUserAndByIdEvent(
            @PathVariable("idEvent") Integer idEvent) {
        try {
            ResponseEvent responseEvent = eventService.findDetailEventByUserAndEventId(idEvent);
            if (responseEvent != null) {
                return new ResponseEntity<>(responseEvent, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Cannot get detail of event with id = " + idEvent);
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @PutMapping("/cancel")
    public ResponseEntity<?> cancelEvent(
            @Param("idEvent") int idEvent) {
        try {
            if (eventService.cancelEvent(idEvent)) {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(0);
                cm.setMessage("cancel event successful");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to cancel event with id =" + idEvent);
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }

    @PutMapping("/permit")
    public ResponseEntity<?> permitEvent(
            @Param("idEvent") int idEvent) {
        try {
            if (eventService.permitEvent(idEvent)) {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(0);
                cm.setMessage("permit event successful");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to permit event with id = " + idEvent);

                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/change-status/{idEvent}")
    public ResponseEntity<?> changeStatusOfEvent(
            @RequestBody Map<Object, Object> updates,
            @PathVariable("idEvent") int id) {
        try {
            ResponseEvent re = eventService.changeStatusEventById(id, updates);
            if (re != null) {
                return new ResponseEntity<>(re, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to change status of event with id = " + id);

                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{idEvent}")
    public ResponseEntity<?> changeDataOfEvent(
            @RequestBody Map<Object, Object> updates,
            @PathVariable("idEvent") int id) {
        try {
            ResponseEvent re = eventService.changeAnyDataOfEvent(id, updates);
            if (re != null) {
                return new ResponseEntity<>(re, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to change data of event with id = " + id);
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter") // filter event by category
    public ResponseEntity<?> filterEventByCategory(
            @RequestParam("email") String email,
            @RequestParam("category") String category,
            @Nullable @RequestParam("statusCode") Integer codeEnd
    ) {
        try {
            List<ResponseEvent> result = eventService.filterByCategory(email,category,codeEnd);
            if (!result.isEmpty()) {
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("There are no events available");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search") // filter event by category equal and containing title of event
    public ResponseEntity<?> filterEventByCategoryAndTitleEvent(
            @RequestParam("email") String email,
            @Nullable @Param("category") String category,
            @RequestParam("title") String title,
            @Nullable @RequestParam("statusCode") Integer codeEnd
    ) {
        try {
            List<ResponseEvent> result;
            if (category != null) {
                result = eventService.filterByCategoryAndTitle(email,category, title,codeEnd);
            } else {
                result = eventService.filterByTitleContaining(email,title, codeEnd);
            }
            if (!result.isEmpty()) {
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("There are no events available");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add-participator")
    public ResponseEntity<?> addParticipatorOfEvent(
            @RequestBody ParticipatorEventRequest participatorEventRequest) {
        try {
            ResponseEvent result = eventService.addUserToListOfParticipation(
                    participatorEventRequest.getIdEvent(), participatorEventRequest.getEmail());
            if (result != null) {
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to add participator to event" +
                        " Because the owner is the same participator or id event and user email is incorrect!!");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/remove-participator")
    public ResponseEntity<?> removeParticipatorOfEvent( //remove by owner or leave by participator.
            @RequestBody ParticipatorEventRequest participatorEventRequest) {
        try {
            Boolean result = eventService.removeUserFromListOfParticipation(
                    participatorEventRequest.getIdEvent(), participatorEventRequest.getEmail());
            if (result) {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(0);
                cm.setMessage("Remove or leave the participators successfully.");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to remove user from participators!!");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/view-event") //1 is created, 2 is operating, 3 is ended
    public ResponseEntity<?> viewEventByUserAndStatus(
            @Nullable @RequestParam("statusCode") Integer statusCode, // [1,3]
            @Nullable @RequestParam("starStart") Integer starStart, // [0,4]
            @Nullable @RequestParam("starEnd") Integer starEnd, // [1,5]
            @Nullable @RequestParam("typeOfDate") Integer typeOfDate,//today(1),yesterday(2),within7days(3),thismonth(4)
            @Nullable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam("dateStart") LocalDate dateStart,
            @Nullable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam("dateEnd") LocalDate dateEnd
            //date for createAt
    ) {
        
        List<ResponseEvent> result =
                eventService.viewEventByUserAndStatus(
                        statusCode,
                        starStart,
                        starEnd,
                        typeOfDate,
                        dateStart,dateEnd

                );
        if (!result.isEmpty()) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            CodeAndMessage cm = new CodeAndMessage();
            cm.setCode(1);
            cm.setMessage("There are no events available");
            return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/event-upcoming") //1 is created, 2 is operating, 3 is ended
    public ResponseEntity<?> viewEventByUserAndStatus(
            @Nullable @RequestParam("number-days") Integer dayUpcoming // before current date
    ) {

        List<ResponseEvent> result =
                eventService.viewUpcomingEventByDateStart(dayUpcoming);
        if (!result.isEmpty()) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            CodeAndMessage cm = new CodeAndMessage();
            cm.setCode(1);
            cm.setMessage("There are no events available");
            return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> removeEventAndAddIntoTrash(@PathVariable("id") Integer idEvent){
        Boolean check  =eventService.deleteEvent(idEvent);
        CodeAndMessage cm = new CodeAndMessage();
        return check ? new ResponseEntity<>(
                CodeAndMessage
                        .builder().code(0).message("Delete event with id = " + idEvent + " successfully!")
                        .build(),HttpStatus.OK) :
                new ResponseEntity<>(
                        CodeAndMessage
                                .builder().code(1).message("Cannot delete event with id = " + idEvent + " successfully!")
                                .build(),HttpStatus.BAD_REQUEST);
    }

}

