package com.duan.server.Services.Implement;

import com.duan.server.Converter.EventConverter;
import com.duan.server.Converter.UserConverter;
import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.StatusDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import com.duan.server.Response.ResponseEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class EventServiceTest {

    @InjectMocks
    private EventService eventService;


     @Mock
    private UserService userService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ImageService imageService;

    @Mock
    private com.duan.server.Repository.EventRepository eventRepository;

    @Mock
    private MailService mailService;

    @Mock
    private StatusService statusService;

    @Mock
    private EventConverter eventConverter;

    @Mock
    private UserConverter userConverter;
    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);

    }
    @Test
    public void testFindById() {
        // Given
        int eventId = 38;

        EventEntity eventEntity = new EventEntity();
        eventEntity.setTitle("Lễ Hội Âm Nhạc");

        EventDTO eventDTO = new EventDTO();
        eventDTO.setTitle("Lễ Hội Âm Nhạc");

        //mock the call
        when(eventRepository.findById(eventId)).thenReturn(eventEntity);
        when(eventConverter.toDTO(any(EventEntity.class))).thenReturn(eventDTO);

        //when
        EventDTO result = eventService.findById(eventId);

        // Then
        assertEquals(eventEntity.getTitle(),result.getTitle());
        // Add more assertions as needed...
    }


    @Test
    public void testFindStatusByEvent() {
        // Given
        int eventId = 38;

        // Mock EventDTO
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(eventId); // Set ID của sự kiện


        StatusDTO statusDTO = new StatusDTO();
        statusDTO.setEnded(true);
        // Mock StatusDTO


        eventDTO.setStatus(statusDTO);
        eventDTO.getStatus().setEnded(true);
        when(eventService.findById(eventId)).thenReturn(eventDTO);
        when(statusService.getStatusByEvent(any(EventDTO.class))).thenReturn(statusDTO);

        // When
        StatusDTO result = eventService.findStatusByEvent(eventId);

        // Then
        assertEquals(eventDTO.getStatus().getEnded(), result.getEnded());

        // Add more assertions as needed...
    }

    @Test
    public void testFindAllEventByUser() {
        // Given
        String userEmail = "hello@gmail.com";

        // Mock behavior for userService
        when(userService.getUserEmailByAuthorization()).thenReturn(userEmail);

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(userEmail);


        // Mock behavior for userService
        when(userService.findUserByEmail(userEmail)).thenReturn(userDTO);

        List<EventEntity> eventEntities = new ArrayList<>();
        // Mock behavior for eventRepository
        when(userConverter.toEntity(any(UserDTO.class))).thenReturn(new UserEntity());
        when(eventRepository.findAllByUser(
                any(UserEntity.class)
        )).thenReturn(eventEntities);

        List<ResponseEvent> responseEvents = new ArrayList<>();
        responseEvents.add(new ResponseEvent());
        // Mock behavior for eventConverter
        for (ResponseEvent responseEvent : responseEvents){
            when(eventConverter.entityConvertToResponseEvent(any(EventEntity.class))).thenReturn(responseEvent);
        }

        // When
        List<ResponseEvent> result = eventService.FindAllEventByUser();

        // Then
        assertNotNull(result);
        assertEquals(0, result.size());
        // Add more assertions as needed...
    }


    @Test
    public void testFindDetailEventByUserAndEventId() {
        // Given
        int eventId = 38; // ID của sự kiện

        String userEmail = "hello@gmail.com";
        // Mock behavior for userService
        when(userService.getUserEmailByAuthorization()).thenReturn(userEmail);

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(userEmail);
        // Mock behavior for userService
        when(userService.findUserByEmail(userEmail)).thenReturn(userDTO);

        // Mock behavior for eventRepository
        UserEntity userEntity = new UserEntity(); // Mock UserEntity
        EventEntity eventEntity = new EventEntity(); // Mock EventEntity
        eventEntity.setId(38);

        when(userConverter.toEntity(any(UserDTO.class))).thenReturn(userEntity);

        when(eventRepository.findByIdAndUser(eventId, userEntity)).thenReturn(eventEntity);

        ResponseEvent responseEvent = new ResponseEvent(); // Mock ResponseEvent
        responseEvent.setId(38);
        // Mock behavior for eventConverter
        when(eventConverter.entityConvertToResponseEvent(eventEntity)).thenReturn(responseEvent);

        // When
        ResponseEvent result = eventService.findDetailEventByUserAndEventId(eventId);

        // Then
        assertNotNull(result);
        assertEquals(eventId, result.getId());
        // Add more assertions as needed...
    }

}