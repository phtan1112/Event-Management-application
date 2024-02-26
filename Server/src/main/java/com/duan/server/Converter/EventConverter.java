package com.duan.server.Converter;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import com.duan.server.Response.ResponseEvent;
import com.duan.server.Response.ResponseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EventConverter {
    @Autowired
    private UserConverter userConverter;
    @Autowired
    private CategoryConverter categoryConverter;
    @Autowired
    private CommentConverter commentConverter;

    public Set<UserDTO> convertParticipatorsToDTO(Set<UserEntity> userEntities) {
        return userEntities
                .stream()
                .map(u -> userConverter.toDto(u))
                .collect(Collectors.toSet());
    }

    public Set<UserEntity> convertParticipatorsToEntity(Set<UserDTO> userDTOS) {
        return userDTOS
                .stream()
                .map(u -> userConverter.toEntity(u))
                .collect(Collectors.toSet());
    }

    public EventEntity toEntity(EventDTO eventDTO) {
        EventEntity eventEntity = new EventEntity();
        if (eventDTO.getId() != null) {
            eventEntity.setId(eventDTO.getId());
        }
        eventEntity.setTitle(eventDTO.getTitle());
        eventEntity.setDescription(eventDTO.getDescription());
        if (eventDTO.getImage1() != null) {
            eventEntity.setImage1(eventDTO.getImage1());
        }
        if (eventDTO.getImage2() != null) {
            eventEntity.setImage2(eventDTO.getImage2());
        }
        if (eventDTO.getImage3() != null) {
            eventEntity.setImage3(eventDTO.getImage3());
        }
        if (eventDTO.getImage4() != null) {
            eventEntity.setImage4(eventDTO.getImage4());
        }
        eventEntity.setPlace(eventDTO.getPlace());
        eventEntity.setStar(eventDTO.getStar());
        eventEntity.setLatitude(eventDTO.getLatitude());
        eventEntity.setLongitude(eventDTO.getLongitude());
        eventEntity.setCancel(eventDTO.getCancel());
        eventEntity.setDate_start(eventDTO.getDate_start());
        eventEntity.setTime_start(eventDTO.getTime_start());
        eventEntity.setTime_end(eventDTO.getTime_end());
        if (eventDTO.getCreatedAt() != null) {
            eventEntity.setCreatedAt(eventDTO.getCreatedAt());
        }
        eventEntity.setUser(userConverter.toEntity(eventDTO.getUser()));
        eventEntity.setCategory(categoryConverter.toEntity(eventDTO.getCategory()));
        eventEntity.setParticipators(convertParticipatorsToEntity(eventDTO.getParticipators()));
        return eventEntity;
    }

    public EventDTO toDTO(EventEntity eventEntity) {
        EventDTO eventDTO = new EventDTO();
        if (eventEntity != null) {
            if (eventEntity.getId() != null) {
                eventDTO.setId(eventEntity.getId());
            }
            eventDTO.setTitle(eventEntity.getTitle());
            eventDTO.setDescription(eventEntity.getDescription());
            if (eventEntity.getImage1() != null) {
                eventDTO.setImage1(eventEntity.getImage1());
            }
            if (eventEntity.getImage2() != null) {
                eventDTO.setImage2(eventEntity.getImage2());
            }
            if (eventEntity.getImage3() != null) {
                eventDTO.setImage3(eventEntity.getImage3());
            }
            if (eventEntity.getImage4() != null) {
                eventDTO.setImage4(eventEntity.getImage4());
            }
            eventDTO.setPlace(eventEntity.getPlace());
            eventDTO.setStar(eventEntity.getStar());
            eventDTO.setLatitude(eventEntity.getLatitude());
            eventDTO.setLongitude(eventEntity.getLongitude());
            eventDTO.setCancel(eventEntity.getCancel());
            eventDTO.setDate_start(eventEntity.getDate_start());
            eventDTO.setTime_start(eventEntity.getTime_start());
            eventDTO.setTime_end(eventEntity.getTime_end());
            eventDTO.setCreatedAt(eventEntity.getCreatedAt());
            eventDTO.setUser(userConverter.toDto(eventEntity.getUser()));
            eventDTO.setCategory(categoryConverter.toDTO(eventEntity.getCategory()));
            //cannot convert status entity to status dto in event converter. it loop permanent
            eventDTO.setParticipators(convertParticipatorsToDTO(eventEntity.getParticipators()));

        }
        return eventDTO;
    }

    public ResponseEvent entityConvertToResponseEvent(EventEntity eventEntity) {
        ResponseEvent.ResponseEventBuilder responseEventBuilder =
                ResponseEvent
                        .builder()
                        .id(eventEntity.getId())
                        .title(eventEntity.getTitle())
                        .description(eventEntity.getDescription())
                        .image1(eventEntity.getImage1())
                        .image2(eventEntity.getImage2())
                        .image3(eventEntity.getImage3())
                        .image4(eventEntity.getImage4())
                        .place(eventEntity.getPlace())
                        .star(eventEntity.getStar())
                        .latitude(eventEntity.getLatitude())
                        .longitude(eventEntity.getLongitude())
                        .cancel(eventEntity.getCancel())
                        .date_start(eventEntity.getDate_start())
                        .time_start(eventEntity.getTime_start())
                        .time_end(eventEntity.getTime_end())
                        .createAt(eventEntity.getCreatedAt())
                        .user(userConverter.toDto(eventEntity.getUser()))
                        .category(categoryConverter.toDTO(eventEntity.getCategory()))
                        .numberOfParticipators((int) eventEntity.getParticipators().stream().count())
                        .participators(convertParticipatorsToDTO(eventEntity.getParticipators()))
                        .comments(
                                commentConverter.convertListCommentOfEventToCommentResponseDTO(
                                        eventEntity.getComments()));

        if (eventEntity.getStatus() != null) {
            return responseEventBuilder
                    .status(ResponseStatus
                            .builder()
                            .created(eventEntity.getStatus().getCreated())
                            .operating(eventEntity.getStatus().getOperating())
                            .ended(eventEntity.getStatus().getEnded())
                            .build())
                    .build();
        } else {
            return responseEventBuilder
                    .status(null)
                    .build();
        }

    }


}
