package com.duan.server.Services.Implement;

import com.duan.server.Converter.CategoryConverter;
import com.duan.server.Converter.EventConverter;
import com.duan.server.Converter.StatusConverter;
import com.duan.server.Converter.UserConverter;
import com.duan.server.DTO.*;
import com.duan.server.Models.CommentEntity;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.StatusEntity;
import com.duan.server.Repository.EventRepository;
import com.duan.server.Response.ResponseEvent;
import com.duan.server.Services.IEventService;
import org.apache.commons.math3.util.Precision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class EventService implements IEventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private StatusService statusService;
    @Autowired
    private StatusConverter statusConverter;
    @Autowired
    private CategoryConverter categoryConverter;
    @Autowired
    private EventConverter eventConverter;
    @Autowired
    private UserConverter userConverter;
    @Autowired
    private ImageService imageService;


    @Override
    @Transactional
    public EventDTO persistEvent(MultipartFile[] images,
                                 String title,
                                 String typeOfEvent,
                                 LocalDate date_start,
                                 LocalTime time_start,
                                 LocalTime time_end,
                                 String description,
                                 String place,
                                 Double latitude,
                                 Double longitude) {

        String emailUser = userService.getUserEmailByAuthorization();

        //get userDTO by email
        UserDTO userDTO = userService.findUserByEmail(emailUser);
        //get userDTO by typeEvent
        CategoryDTO categoryDTO = categoryService.findByType(typeOfEvent);
        if (userDTO.getId() != null && categoryDTO.getId() != null &&
                checkStartDateAndTimeStartIsAfterOrNot(date_start,time_start,time_end)) {
            //get URL image after uploaded on Cloudinary
            List<String> urls = Arrays.stream(images).map(image -> imageService.uploadImage(image)).toList();

            if (urls.size() == 4) {
                EventDTO eventDTO = EventDTO.builder()
                        .title(title)
                        .description(description)
                        .image1(urls.get(0))
                        .image2(urls.get(1))
                        .image3(urls.get(2))
                        .image4(urls.get(3))
                        .place(place)
                        .latitude(latitude)
                        .longitude(longitude)
                        .star(0.0)
                        .cancel(false)
                        .date_start(date_start)
                        .time_start(time_start)
                        .time_end(time_end)
                        .createdAt(LocalDate.now())
                        .user(userDTO)
                        .category(categoryDTO)
                        .participators(new HashSet<>())
                        .build();

                //persist to database
                EventEntity eventEntity = eventConverter.toEntity(eventDTO);
                eventEntity = eventRepository.save(eventEntity);
                eventDTO = eventConverter.toDTO(eventEntity);

                //generate status for event after created
                StatusDTO statusDTO = statusService.generate(
                        new StatusDTO(true, false, false, eventDTO));
                statusDTO.setEvent(null);
                eventDTO.setStatus(statusDTO);

                return eventDTO;
            }
        }
        return null;
    }

    private boolean checkStartDateAndTimeStartIsAfterOrNot(LocalDate date_start,
                                                           LocalTime time_start,
                                                           LocalTime time_end) {
        LocalDate date_now = LocalDate.now();
        LocalTime time_now = LocalTime.now();
        if ( (date_start.isAfter(date_now) || date_start.isEqual(date_now)) &&
                time_start.isAfter(time_now) &&
                time_end.isAfter(time_now) &&
                time_end.isAfter(time_start)
        ) {
            return true;
        }
        return false;
    }

    @Override
    public EventDTO findById(int id) {
        EventEntity eventEntity = eventRepository.findById(id);
        return eventConverter.toDTO(eventEntity);
    }

    @Override
    public StatusDTO findStatusByEvent(int idEvent) {
        EventDTO eventDTO = findById(idEvent);
        if (eventDTO.getId() != null) {
            StatusDTO statusDTO = statusService.getStatusByEvent(eventDTO);
            return statusDTO;
        }
        return null;
    }

    @Override
    public List<ResponseEvent> FindAllEventByUser() {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        List<ResponseEvent> rs = new ArrayList<>();
        if (userDTO != null) {
            List<EventEntity> lstEventEntity = eventRepository.findAllByUser(userConverter.toEntity(userDTO));
            lstEventEntity.forEach(e -> {
                rs.add(eventConverter.entityConvertToResponseEvent(e));
            });
            return rs;
        }
        return null;
    }

    @Override
    public ResponseEvent findDetailEventByUserAndEventId(int id) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        if (userDTO != null) {
            EventEntity eventEntity = eventRepository.findByIdAndUser(id, userConverter.toEntity(userDTO));
            if (eventEntity != null) {
                return eventConverter.entityConvertToResponseEvent(eventEntity);
            }
        }
        return null;
    }

    public EventDTO findEventByEmailUserAndEventId(String email, int id) {
        if (email != null) {
            email = userService.getUserEmailByAuthorization();
        }
        UserDTO userDTO = userService.findUserByEmail(email);
        if (userDTO != null) {
            EventEntity eventEntity = eventRepository.findByIdAndUser(id, userConverter.toEntity(userDTO));
            if (eventEntity != null) {
                return eventConverter.toDTO(eventEntity);
            }
        }
        return null;
    }

    @Override
    public Boolean cancelEvent(int id) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        EventEntity eventEntity = eventRepository.findByIdAndUser(id, userConverter.toEntity(userDTO));
        if (eventEntity != null && !eventEntity.getCancel()) {
            eventEntity.setCancel(true);
            eventRepository.save(eventEntity);
            return true;
        }
        return false;
    }

    @Override
    public Boolean permitEvent(int id) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        EventEntity eventEntity = eventRepository.findByIdAndUser(id, userConverter.toEntity(userDTO));
        if (eventEntity != null && eventEntity.getCancel()) {
            eventEntity.setCancel(false);
            eventRepository.save(eventEntity);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public ResponseEvent changeStatusEventById(int idEvent, Map<Object, Object> fields) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        EventEntity eventEntity = eventRepository.findByIdAndUser(idEvent, userConverter.toEntity(userDTO));
        if (eventEntity.getId() != null) {
            StatusEntity statusEntity = statusConverter.toEntity(
                    statusService.getStatusByEvent(findById(idEvent)));

            if (statusEntity != null) {
                statusEntity = statusService.changeStatusOfEvent(statusEntity, fields);
                eventEntity.setStatus(statusEntity);
                return eventConverter.entityConvertToResponseEvent(eventEntity);
            }
        }
        return null;
    }


    @Override
    @Transactional
    public ResponseEvent changeAnyDataOfEvent(int idEvent, Map<Object, Object> fields) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        EventEntity eventEntity = eventRepository.findByIdAndUser(idEvent, userConverter.toEntity(userDTO));
        if (eventEntity.getId() != null) {
            fields.forEach((key, value) -> {
                String parseKey = (String) key;

                if (parseKey.equalsIgnoreCase("user_email")) {
                    parseKey = "user";
                    value = userConverter.toEntity(userService.findUserByEmail(String.valueOf(value)));
                }
                if (parseKey.equalsIgnoreCase("category_type")) {
                    parseKey = "category";
                    value = categoryConverter.toEntity(categoryService.findByType(String.valueOf(value)));
                }


                Field field = ReflectionUtils.findField(EventEntity.class, parseKey);
                field.setAccessible(true);
                System.out.println(parseKey);


                ReflectionUtils.setField(field, eventEntity, value);
            });
            EventEntity finalEventEntity = eventRepository.save(eventEntity);
            return eventConverter.entityConvertToResponseEvent(finalEventEntity);
        }
        return null;
    }

    @Override
    public ResponseEvent uploadImage(MultipartFile[] images, int idEvent) {
        EventDTO eventDTO = findById(idEvent);
        List<String> urls = new ArrayList<>();
        for (MultipartFile image : images) {
            urls.add(imageService.uploadImage(image));
        }
        eventDTO.setImage1(urls.get(0));
        eventDTO.setImage2(urls.get(1));
        eventDTO.setImage3(urls.get(2));
        eventDTO.setImage4(urls.get(3));


        EventEntity finalEventEntity = eventRepository.save(eventConverter.toEntity(eventDTO));
        ResponseEvent event = eventConverter.entityConvertToResponseEvent(finalEventEntity);
        System.out.println(event);
        return event;
    }

    @Override
    public List<ResponseEvent> getAllEvents() {
        return eventRepository
                .findAll()
                .stream()
                .map(e -> eventConverter.entityConvertToResponseEvent(e))
                .toList();
    }

    @Override
    public List<EventDTO> getAllEventsByStatusEndedIsFalse() {
        return eventRepository
                .findAll()
                .stream()
                .filter(e -> !e.getStatus().getEnded()
                )
                .map(e -> eventConverter.toDTO(e))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean changeStatusEventByIdEventForSchedule(EventDTO eventDTO, Map<Object, Object> fields) {
        StatusEntity statusEntity = statusConverter.toEntity(
                statusService.getStatusByEvent(findById(eventDTO.getId())));
        if (statusEntity != null) {
            statusService.changeStatusOfEvent(statusEntity, fields);
            return true;
        }
        return false;
    }

    @Override
    public List<ResponseEvent> filterByCategory(String typeOfEvent) {
        return eventRepository
                .findAllByCategoryEqual(typeOfEvent)
                .stream()
                .map(e -> eventConverter.entityConvertToResponseEvent(e))
                .collect(Collectors.toList());
    }

    @Override
    public List<ResponseEvent> filterByCategoryAndTitle(String typeOfEvent, String title) {
        return eventRepository
                .findAllByTitleAndCategoryEqual(typeOfEvent, title)
                .stream()
                .map(e -> eventConverter.entityConvertToResponseEvent(e))
                .collect(Collectors.toList());
    }

    @Override
    public List<ResponseEvent> filterByTitleContaining(String title) {
        return eventRepository
                .findByTitleContaining(title)
                .stream()
                .map(e -> eventConverter.entityConvertToResponseEvent(e))
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEvent addUserToListOfParticipation(int idEvent, String email) {
        UserDTO userDTO = userService.findUserByEmail(email);
        EventDTO eventDTO = findById(idEvent);
        if (userDTO.getId() != null &&
                eventDTO.getId() != null &&
                !checkUserIsInParticipatorsOrNot(userDTO, eventDTO.getParticipators()) &&
                eventDTO.getUser().getId() != userDTO.getId()
        ) {

            eventDTO.addUserDTO(userDTO);
            EventEntity eventEntity = eventConverter.toEntity(eventDTO);
            eventEntity = eventRepository.save(eventEntity);
            return eventConverter.entityConvertToResponseEvent(eventEntity);
        }
        return null;
    }

    public Boolean checkUserIsInParticipatorsOrNot(UserDTO userDTO, Set<UserDTO> participators) {
        for (UserDTO userDTO1 : participators) {
            if (userDTO1.getEmail().equals(userDTO.getEmail())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void calculateStarOfEvent(int idEvent) {
        int count = 0;
        Double sum = 0.0;
        EventEntity eventEntity = eventRepository.findById(idEvent);
        for (CommentEntity commentEntity : eventEntity.getComments()) {
            sum += commentEntity.getStar();
            count += 1;
        }
        if (count > 0) {
            Double rs = Precision.round(sum / count,1);
            eventEntity.setStar(rs);
            eventRepository.save(eventEntity);
        }
    }

    @Override
    public List<ResponseEvent> viewEventByUserAndStatus(int statusCode) {
        String email = userService.getUserEmailByAuthorization();
        return eventRepository
                .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                .stream()
                .filter(e ->{
                    if(statusCode ==1) return e.getStatus().getCreated();
                    if(statusCode ==2) return e.getStatus().getOperating();
                    if(statusCode ==3) return e.getStatus().getEnded();
                    return Boolean.parseBoolean(null);
                        }
                )
                .map(e -> eventConverter.entityConvertToResponseEvent(e))
                .collect(Collectors.toList());
    }//e.getStatus().getEnded()

}
