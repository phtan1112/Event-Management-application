package com.duan.server.Services.Implement;

import com.duan.server.Converter.*;
import com.duan.server.DTO.*;
import com.duan.server.Models.CommentEntity;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.StatusEntity;
import com.duan.server.Repository.EventRepository;
import com.duan.server.Response.ResponseEvent;
import com.duan.server.Services.IEventService;
import jdk.jfr.consumer.EventStream;
import org.apache.catalina.User;
import org.apache.commons.math3.util.Precision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;


@Service
@EnableAsync
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

    @Autowired
    private CommentService commentService;
    @Autowired
    private MailService mailService;


    @Autowired
    private Executor asyncExecutor;


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
                checkStartDateAndTimeStartIsAfterOrNot(date_start, time_start, time_end) && // start event is always after now date.
                !eventRepository.existsByTitle(title)
        ) {
            List<String> urls = new ArrayList<>();

            List<CompletableFuture<Void>> uploadFutures = new ArrayList<>();

            for (int i = 0; i < 4; i++) {
                final int index = i;
                CompletableFuture<Void> uploadFuture = CompletableFuture.runAsync(() -> {
                    try {
                        urls.add(imageService.uploadImage(images[index]).get());
                    } catch (InterruptedException | ExecutionException e) {
                        throw new RuntimeException(e);
                    }
                }, asyncExecutor);

                uploadFutures.add(uploadFuture);
            }
            //wait for threads completed
            uploadFutures.forEach(CompletableFuture::join);

            EventDTO eventDTO = EventDTO.builder()
                    .title(title)
                    .description(description)
                    .place(place)
                    .latitude(latitude)
                    .longitude(longitude)
                    .star(0.0)
                    .cancel(false)
                    .date_start(date_start)
                    .time_start(time_start)
                    .time_end(time_end)
                    .createdAt(LocalDateTime.now())
                    .user(userDTO)
                    .category(categoryDTO)
                    .participators(new HashSet<>())
                    .image1(urls.get(0))
                    .image2(urls.get(1))
                    .image3(urls.get(2))
                    .image4(urls.get(3))
                    .build();

            //persist to database
            EventEntity eventEntity = eventConverter.toEntity(eventDTO);
            eventEntity = eventRepository.save(eventEntity);
            eventDTO = eventConverter.toDTO(eventEntity);
            //send email when email is successful created
            mailService.sendEventSuccessfulCreated(userDTO.getEmail(), eventDTO);

            //generate status for event after created
            StatusDTO statusDTO = statusService.generate(
                    new StatusDTO(true, false, false, eventDTO));
            statusDTO.setEvent(null);
            eventDTO.setStatus(statusDTO);


            return eventDTO;
        }
        return null;
    }

    private boolean checkStartDateAndTimeStartIsAfterOrNot(LocalDate date_start,
                                                           LocalTime time_start,
                                                           LocalTime time_end) {
        LocalDate date_now = LocalDate.now();
        LocalTime time_now = LocalTime.now();
        if ((date_start.isAfter(date_now))) {
            return true;
        } else if (date_start.isEqual(date_now)) {
            if (time_start.isAfter(time_now) && time_end.isAfter(time_now)) {
                if (time_end.isAfter(time_start)) return true;
            }
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
        if (eventDTO != null) {
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
        if (eventEntity != null && !eventEntity.getCancel()) {
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
        if (eventEntity != null && !eventEntity.getCancel()) {
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
            try {
                urls.add(imageService.uploadImage(image).get());
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } catch (ExecutionException e) {
                throw new RuntimeException(e);
            }
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
    public List<ResponseEvent> getAllEvents(String email, Integer codeEnd) {
        List<ResponseEvent> lst = null;
        UserDTO userDTO = userService.findUserByEmail(email);
        if (userDTO != null) {
            if (codeEnd == null) {
                lst = eventRepository
                        .findAll()
                        .stream()
                        .filter(e -> !e.getUser().getEmail().equalsIgnoreCase(email) && !e.getCancel())
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .toList();
            }
            if (codeEnd != null && codeEnd == 1) {
                lst = eventRepository
                        .findAll()
                        .stream()
                        .filter(e -> !e.getStatus().getEnded() && !e.getUser().getEmail().equalsIgnoreCase(email)
                                && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .toList();
            }
        } else {
            if (codeEnd == null) {
                lst = eventRepository
                        .findAll()
                        .stream()
                        .filter(e -> !e.getCancel())
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .toList();
            }
            if (codeEnd != null && codeEnd == 1) {
                lst = eventRepository
                        .findAll()
                        .stream()
                        .filter(e -> !e.getStatus().getEnded() && !e.getCancel())
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .toList();
            }
        }
        return lst != null ? lst : new ArrayList<>();
    }

    @Override
    public List<EventDTO> getAllEventsByStatusEndedIsFalse() {
        return eventRepository
                .findAll()
                .stream()
                .filter(e -> !e.getStatus().getEnded() && !e.getCancel()
                )
                .map(e -> eventConverter.toDTO(e))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean changeStatusEventByIdEventForSchedule(EventDTO eventDTO, Map<Object, Object> fields) {
        if (!eventDTO.getCancel()) {
            StatusEntity statusEntity = statusConverter.toEntity(
                    statusService.getStatusByEvent(findById(eventDTO.getId())));
            if (statusEntity != null) {
                statusService.changeStatusOfEvent(statusEntity, fields);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<ResponseEvent> filterByCategory(String email, String typeOfEvent, Integer codeEnd) {
        List<ResponseEvent> lst = null;
        UserDTO userDTO = userService.findUserByEmail(email);
        if (userDTO != null) {
            if (codeEnd == null) {
                lst = eventRepository
                        .findAllByCategoryEqual(typeOfEvent)
                        .stream()
                        .filter(e -> !e.getUser().getEmail().equalsIgnoreCase(email) && !e.getCancel())
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
            if (codeEnd != null && codeEnd == 1) {
                lst = eventRepository
                        .findAllByCategoryEqual(typeOfEvent)
                        .stream()
                        .filter(e -> !e.getStatus().getEnded() && !e.getUser().getEmail().equalsIgnoreCase(email)
                                && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
        }
        return lst != null ? lst : new ArrayList<>();
    }

    @Override
    public List<ResponseEvent> filterByCategoryAndTitle(String email, String typeOfEvent, String title, Integer codeEnd) {

        List<ResponseEvent> lst = null;
        UserDTO userDTO = userService.findUserByEmail(email);
        if (userDTO != null) {
            if (codeEnd == null) {
                lst = eventRepository
                        .findAllByTitleAndCategoryEqual(typeOfEvent, title)
                        .stream()
                        .filter(e -> !e.getUser().getEmail().equalsIgnoreCase(email) && !e.getCancel())
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
            if (codeEnd != null && codeEnd == 1) {
                lst = eventRepository
                        .findAllByTitleAndCategoryEqual(typeOfEvent, title)
                        .stream()
                        .filter(e -> !e.getStatus().getEnded() && !e.getUser().getEmail().equalsIgnoreCase(email)
                                && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());

            }
        }
        return lst != null ? lst : new ArrayList<>();
    }

    @Override
    public List<ResponseEvent> filterByTitleContaining(String email, String title, Integer codeEnd) {

        List<ResponseEvent> lst = null;
        UserDTO userDTO = userService.findUserByEmail(email);
        if (userDTO != null) {
            if (codeEnd == null) {
                lst = eventRepository
                        .findByTitleContaining(title)
                        .stream()
                        .filter(e -> !e.getUser().getEmail().equalsIgnoreCase(email)
                                && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
            if (codeEnd != null && codeEnd == 1) {
                lst = eventRepository
                        .findByTitleContaining(title)
                        .stream()
                        .filter(e -> !e.getStatus().getEnded() && !e.getUser().getEmail().equalsIgnoreCase(email)
                                && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
        }
        return lst != null ? lst : new ArrayList<>();
    }

    @Override
    public ResponseEvent addUserToListOfParticipation(int idEvent, String email) {
        UserDTO userDTO = userService.findUserByEmail(email);
        EventDTO eventDTO = findById(idEvent);
        if (userDTO != null &&
                eventDTO != null && !eventDTO.getCancel() &&
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

    @Transactional
    @Override
    public Boolean removeUserFromListOfParticipation(int idEvent, String email) {
        UserDTO userDTO = userService.findUserByEmail(email);
        EventDTO eventDTO = findById(idEvent);
        if (userDTO != null &&
                eventDTO != null && !eventDTO.getCancel() &&
                checkUserIsInParticipatorsOrNot(userDTO, eventDTO.getParticipators())
        ) {
            eventDTO.removeUserToParticipatorsList(userDTO);
            EventEntity eventEntity = eventConverter.toEntity(eventDTO);
            eventRepository.save(eventEntity);
            return true;
        }
        return false;
    }


    @Override
    public void calculateStarOfEvent(int idEvent) {
        int count = 0;
        Double sum = 0.0;
        EventEntity eventEntity = eventRepository.findById(idEvent);
        if (eventEntity.getComments().size() > 0) {
            for (CommentEntity commentEntity : eventEntity.getComments()) {
                sum += commentEntity.getStar();
                count += 1;
            }
            if (count > 0) {
                Double rs = Precision.round(sum / count, 1);
                eventEntity.setStar(rs);
            }
        } else {
            eventEntity.setStar(0.0);
        }
        eventRepository.save(eventEntity);
    }

    @Override
    public List<ResponseEvent> viewEventByUserAndStatus(Integer statusCode,
                                                        Integer starStart, Integer starEnd,
                                                        Integer star,
                                                        Integer typeOfDate,
                                                        LocalDate dateStart, LocalDate dateEnd) {
        String email = userService.getUserEmailByAuthorization();
        List<ResponseEvent> filterEvents = null;

        if (statusCode != null && starStart != null && starEnd != null &&
                typeOfDate == null && dateStart == null && dateEnd == null && star == null
        ) {// filter by statusCode, star
            if (statusCode >= 1 && statusCode <= 3 &&
                    starStart >= 0 && starStart <= 4 &&
                    starEnd <= 5 && starEnd >= 1
                    && starEnd > starStart
            ) {
                filterEvents = eventRepository
                        .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                        .stream()
                        .filter(e -> {
                                    if (statusCode == 1)
                                        return e.getStatus().getCreated() && !e.getStatus().getOperating() && !e.getStatus().getEnded()
                                                && e.getStar() >= starStart && e.getStar() <= starEnd
                                                && !e.getCancel();
                                    if (statusCode == 2)
                                        return e.getStatus().getOperating() && !e.getStatus().getEnded()
                                                && e.getStar() >= starStart && e.getStar() <= starEnd
                                                && !e.getCancel();
                                    if (statusCode == 3)
                                        return e.getStatus().getEnded() && e.getStar() >= starStart && e.getStar() <= starEnd
                                                && !e.getCancel();
                                    return Boolean.parseBoolean(null);

                                }
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
        } else if (statusCode != null && starStart == null && starEnd == null &&
                typeOfDate == null && dateStart == null && dateEnd == null && star == null
        ) {// filter by status code
            filterEvents = eventRepository
                    .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                    .stream()
                    .filter(e -> {

                                if (statusCode == 1) return e.getStatus().getCreated() && !e.getStatus().getOperating()
                                        && !e.getStatus().getEnded() && !e.getCancel();
                                if (statusCode == 2) return e.getStatus().getOperating() &&
                                        !e.getStatus().getEnded() && !e.getCancel();
                                if (statusCode == 3) return e.getStatus().getEnded() && !e.getCancel();
                                return Boolean.parseBoolean(null);
                            }
                    )
                    .map(e -> eventConverter.entityConvertToResponseEvent(e))
                    .collect(Collectors.toList());
        } else if (statusCode == null && starEnd != null && starStart != null &&
                typeOfDate == null && dateStart == null && dateEnd == null && star == null
        ) {// filter by star
            if (starStart >= 0 && starStart <= 4 &&
                    starEnd <= 5 && starEnd >= 1
                    && starEnd > starStart) {
                filterEvents = eventRepository
                        .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                        .stream()
                        .filter(e -> e.getStar() >= starStart && e.getStar() <= starEnd && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .collect(Collectors.toList());
            }
        } else if (statusCode == null && starStart == null && starEnd == null &&
                typeOfDate != null && dateStart == null && dateEnd == null && star == null
        ) { // filter by typeOfDate || //today(1), yesterday(2), within7days(3),thisMonth(4)
            if (typeOfDate >= 1 && typeOfDate <= 4) {
                LocalDate currentDate = LocalDate.now();
                if (typeOfDate == 1) { //today
                    filterEvents = eventRepository
                            .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now()) && !e.getCancel()
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 2) { //yesterday
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now().minusDays(1))
                                    && !e.getCancel())
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 3) { //within7days
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(LocalDate.now().minusDays(7))
                                    || e.getCreatedAt().toLocalDate().isEqual(LocalDate.now())) && !e.getCancel()
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 4) { //this_month
                    LocalDate thisMonth = LocalDate.of(
                            currentDate.getYear(),
                            currentDate.getMonth(),
                            1);

                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(thisMonth) ||
                                    e.getCreatedAt().toLocalDate().isEqual(thisMonth)) && !e.getCancel()
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }

            }
        } else if (statusCode == null && starStart == null && starEnd == null &&
                typeOfDate == null && dateStart != null && dateEnd != null && star == null
        ) { // specific period of date
            LocalDate currentDate = LocalDate.now();
            if (dateStart.isBefore(currentDate.plusDays(1)) &&
                    (dateEnd.isBefore(currentDate) || dateEnd.isEqual(currentDate)) &&
                    dateStart.isBefore(dateEnd)
            ) {
                filterEvents = eventRepository
                        .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                        .stream()
                        .filter(e -> e.getCreatedAt().toLocalDate().isAfter(dateStart) &&
                                (e.getCreatedAt().toLocalDate().isBefore(dateEnd) ||
                                        e.getCreatedAt().toLocalDate().isEqual(dateEnd)) && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                        .collect(Collectors.toList());
            }
        } else if (statusCode != null && starStart != null && starEnd != null &&
                typeOfDate == null && dateStart != null && dateEnd != null && star == null
        ) { // filter by (star,status, dateStart, DateEnd)
            LocalDate currentDate = LocalDate.now();
            if (statusCode >= 1 && statusCode <= 3 &&
                    starStart >= 0 && starStart <= 4 &&
                    starEnd <= 5 && starEnd >= 1
                    && starEnd > starStart &&
                    dateStart.isBefore(currentDate.plusDays(1)) &&
                    (dateEnd.isBefore(currentDate) || dateEnd.isEqual(currentDate)) &&
                    dateStart.isBefore(dateEnd)
            ) {
                filterEvents = eventRepository
                        .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                        .stream()
                        .filter(e -> {
                                    if (statusCode == 1)
                                        return e.getStatus().getCreated() && !e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                e.getStar() >= starStart && e.getStar() <= starEnd && !e.getCancel() &&
                                                e.getCreatedAt().toLocalDate().isAfter(dateStart) &&
                                                (e.getCreatedAt().toLocalDate().isBefore(dateEnd) ||
                                                        e.getCreatedAt().toLocalDate().isEqual(dateEnd))
                                                ;
                                    if (statusCode == 2)
                                        return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                e.getStar() >= starStart && e.getStar() <= starEnd && !e.getCancel() &&
                                                e.getCreatedAt().toLocalDate().isAfter(dateStart) &&
                                                (e.getCreatedAt().toLocalDate().isBefore(dateEnd) ||
                                                        e.getCreatedAt().toLocalDate().isEqual(dateEnd));
                                    if (statusCode == 3)
                                        return e.getStatus().getEnded() &&
                                                e.getStar() >= starStart && e.getStar() <= starEnd && !e.getCancel() &&
                                                e.getCreatedAt().toLocalDate().isAfter(dateStart) &&
                                                (e.getCreatedAt().toLocalDate().isBefore(dateEnd) ||
                                                        e.getCreatedAt().toLocalDate().isEqual(dateEnd));
                                    return Boolean.parseBoolean(null);
                                }
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .sorted(Comparator.comparing(ResponseEvent::getStar))
                        .collect(Collectors.toList());
            }
        } else if (statusCode == null && starStart == null && starEnd == null &&
                typeOfDate == null && dateStart == null && dateEnd == null && star != null) {
            // get by star [1,5], if 3 so will get from 0 to 3
            if (star >= 1 && star <= 5) {
                filterEvents = eventRepository
                        .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                        .stream()
                        .filter(e ->
                                e.getStar() <= star && !e.getCancel()
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .sorted(Comparator.comparing(ResponseEvent::getStar))
                        .collect(Collectors.toList());
            }

        } else if (statusCode != null && starStart == null && starEnd == null &&
                typeOfDate == null && dateStart == null && dateEnd == null && star != null) {
            // get by star [1,5], if 3 so will get from 0 to 3
            if (statusCode >= 1 && statusCode <= 3 && star >= 1 && star <= 5) {
                filterEvents = eventRepository
                        .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                        .stream()
                        .filter(e -> {
                                    if (statusCode == 1)
                                        return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                !e.getStatus().getEnded() && e.getStar() <= star && !e.getCancel();
                                    if (statusCode == 2)
                                        return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                e.getStar() <= star && !e.getCancel();
                                    if (statusCode == 3)
                                        return e.getStatus().getEnded() &&
                                                e.getStar() <= star && !e.getCancel();
                                    return Boolean.parseBoolean(null);
                                }
                        )
                        .map(e -> eventConverter.entityConvertToResponseEvent(e))
                        .sorted(Comparator.comparing(ResponseEvent::getStar))
                        .collect(Collectors.toList());
            }

        } else if (statusCode == null && starStart == null && starEnd == null &&
                typeOfDate != null && dateStart == null && dateEnd == null && star != null
        ) { // filter by typeOfDate || //today(1), yesterday(2), within7days(3),thisMonth(4)
            if (typeOfDate >= 1 && typeOfDate <= 4 && star >= 1 && star <= 5) {
                LocalDate currentDate = LocalDate.now();
                if (typeOfDate == 1) { //today
                    filterEvents = eventRepository
                            .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now()) && !e.getCancel()
                                    && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 2) { //yesterday
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    e.getCreatedAt().toLocalDate().isEqual(LocalDate.now().minusDays(1))
                                            && !e.getCancel() && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 3) { //withinlast7days
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(LocalDate.now().minusDays(7))
                                    || e.getCreatedAt().toLocalDate().isEqual(LocalDate.now())) && !e.getCancel()
                                    && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 4) { //this_month
                    LocalDate thisMonth = LocalDate.of(
                            currentDate.getYear(),
                            currentDate.getMonth(),
                            1);

                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(thisMonth) ||
                                    e.getCreatedAt().toLocalDate().isEqual(thisMonth)) && !e.getCancel()
                                    && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }

            }
        }
        else if (statusCode != null && starStart == null && starEnd == null &&
                typeOfDate != null && dateStart == null && dateEnd == null && star == null
        ) { // filter by typeOfDate || //today(1), yesterday(2), within7days(3),thisMonth(4)
            if (typeOfDate >= 1 && typeOfDate <= 4 && statusCode >= 1 && statusCode <= 3) {
                LocalDate currentDate = LocalDate.now();

                if (typeOfDate == 1) { //today
                    filterEvents = eventRepository
                            .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                     !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                     !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now()))
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 2) { //yesterday
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now().minusDays(1))
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 3) { //withinlast7days
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(LocalDate.now().minusDays(7))
                                    || e.getCreatedAt().toLocalDate().isEqual(LocalDate.now()))
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 4) { //this_month
                    LocalDate thisMonth = LocalDate.of(
                            currentDate.getYear(),
                            currentDate.getMonth(),
                            1);

                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(thisMonth) ||
                                    e.getCreatedAt().toLocalDate().isEqual(thisMonth))
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }

            }
        }
        else if (statusCode != null && starStart == null && starEnd == null &&
                typeOfDate != null && dateStart == null && dateEnd == null && star != null
        ) { // filter by typeOfDate || //today(1), yesterday(2), within7days(3),thisMonth(4)
            if (typeOfDate >= 1 && typeOfDate <= 4 && statusCode >= 1 && statusCode <= 3
                    && star >= 1 && star <= 5
            ) {
                LocalDate currentDate = LocalDate.now();

                if (typeOfDate == 1) { //today
                    filterEvents = eventRepository
                            .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel() ;
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now()) && e.getStar() <= star)
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 2) { //yesterday
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> e.getCreatedAt().toLocalDate().isEqual(LocalDate.now().minusDays(1))
                                    && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 3) { //withinlast7days
                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(LocalDate.now().minusDays(7))
                                    || e.getCreatedAt().toLocalDate().isEqual(LocalDate.now()))
                                    && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }
                if (typeOfDate == 4) { //this_month
                    LocalDate thisMonth = LocalDate.of(
                            currentDate.getYear(),
                            currentDate.getMonth(),
                            1);

                    filterEvents = eventRepository
                            .findAllByUser(
                                    userConverter.toEntity(userService.findUserByEmail(email)))
                            .stream()
                            .filter(e ->
                                    {
                                        if (statusCode == 1)
                                            return e.getStatus().getCreated() && !e.getStatus().getOperating() &&
                                                    !e.getStatus().getEnded() &&  !e.getCancel();
                                        if (statusCode == 2)
                                            return e.getStatus().getOperating() && !e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        if (statusCode == 3)
                                            return e.getStatus().getEnded() &&
                                                    !e.getCancel();
                                        return Boolean.parseBoolean(null);
                                    }
                            )
                            .filter(e -> (e.getCreatedAt().toLocalDate().isAfter(thisMonth) ||
                                    e.getCreatedAt().toLocalDate().isEqual(thisMonth))
                                    && e.getStar() <= star
                            )
                            .map(e -> eventConverter.entityConvertToResponseEvent(e))
                            .sorted(Comparator.comparing(e -> e.getCreateAt().toLocalDate()))
                            .collect(Collectors.toList());
                }

            }
        }
        return filterEvents != null ? filterEvents : new ArrayList<>();
    }

    @Override
    public List<ResponseEvent> viewUpcomingEventByDateStart(Integer numberDays) {
        String email = userService.getUserEmailByAuthorization();
        LocalDate currentDate = LocalDate.now();
        LocalDate filterDate = currentDate.plusDays(numberDays + 1);
        return numberDays >= 0 ? eventRepository
                .findAllByUser(userConverter.toEntity(userService.findUserByEmail(email)))
                .stream()
                .filter(e ->
                        e.getDate_start().isBefore(filterDate)
                                && (
                                e.getDate_start().isAfter(currentDate) ||
                                        e.getDate_start().isEqual(currentDate)
                        ) &&
                                !e.getCancel()
                )
                .map(e -> eventConverter.entityConvertToResponseEvent(e))
                .sorted(Comparator.comparing(ResponseEvent::getDate_start))
                .collect(Collectors.toList())
                : new ArrayList<>();
    }


    @Transactional
    @Override
    public Boolean deleteEvent(Integer idEvent) {
        UserDTO userDTO = userService.findUserByEmail();
        EventEntity eventEntity = eventConverter.toEntity(findById(idEvent));
        if (eventEntity != null && eventEntity.getUser().getId() == userDTO.getId()) {
            EventDTO eventDTO = eventConverter.toDTO(eventEntity);

            statusService.deleteStatusByEvent(eventDTO);
            commentService.deleteCommentByEvent(eventDTO);

            eventEntity.getParticipators().clear();
            eventRepository.save(eventEntity);

            userService.removeAllEventOfSavedListEvent(eventDTO.getId());
            eventRepository.delete(eventEntity);

            //delete 4 pictures
            imageService.removeImageExist(eventDTO.getImage1());
            imageService.removeImageExist(eventDTO.getImage2());
            imageService.removeImageExist(eventDTO.getImage3());
            imageService.removeImageExist(eventDTO.getImage4());

            return true;
        }
        return false;
    }

    @Override
    public List<ResponseEvent> getAllEventsByUserParticipated(Integer idUser) {
        Set<EventEntity> listEventEntity = eventRepository.findAllEventOfUserParticipated(idUser);
        return listEventEntity.stream()
                .collect(Collectors.toList())
                .stream()
                .map(eventEntity -> eventConverter.entityConvertToResponseEvent(eventEntity))
                .collect(Collectors.toList());
    }


}
