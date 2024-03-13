package com.duan.server.Converter;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserConverter {


    @Autowired
    private EventConverter eventConverter;

    public Set<EventDTO> convertEventSavedListToDTO(Set<EventEntity> eventEntityList) {
        return eventEntityList
                .stream()
                .map(e -> eventConverter.toDTO(e))
                .collect(Collectors.toSet());
    }

    public Set<EventEntity> convertEventSavedListToEntity(Set<EventDTO> eventDTOList) {
        return eventDTOList
                .stream()
                .map(e -> eventConverter.toEntity(e))
                .collect(Collectors.toSet());
    }

    public UserEntity toEntity(UserDTO userDTO) {
        UserEntity userEntity = new UserEntity();
        if (userDTO != null) {
            if (userDTO.getId() != null) {
                userEntity.setId(userDTO.getId());
            }
            userEntity.setFullName(userDTO.getFullName());
            userEntity.setEmail(userDTO.getEmail());
            if (userDTO.getPassword().startsWith("$2a$12$")) {
                userEntity.setPassword("************");
            } else {
                userEntity.setPassword(userDTO.getPassword());
            }
            userEntity.setAvatar(userDTO.getAvatar());
            userEntity.setRole(userDTO.getRole());
            if (userDTO.getCreatedAt() != null) {
                userEntity.setCreatedAt(userDTO.getCreatedAt());
            }
            userEntity.setLogin_times(userDTO.getLogin_times());
        }
        return userEntity;
    }

    public UserDTO toDto(UserEntity userEntity) {
        if(userEntity != null){
            UserDTO userDTO = new UserDTO();
            if (userEntity.getId() != null) {
                userDTO.setId(userEntity.getId());
            }
            userDTO.setFullName(userEntity.getFullName());
            userDTO.setEmail(userEntity.getEmail());
            if (userEntity.getPassword().startsWith("$2a$12$")) {
                userDTO.setPassword("************");
            } else {
                userDTO.setPassword(userEntity.getPassword());
            }
            userDTO.setAvatar(userEntity.getAvatar());
            userDTO.setRole(userEntity.getRole());
            userDTO.setCreatedAt(userEntity.getCreatedAt());
            userDTO.setLogin_times(userEntity.getLogin_times());
            return userDTO;
        }
        return null;
    }

    public UserEntity toEntityNotHidePassword(UserDTO userDTO) {
        UserEntity userEntity = new UserEntity();
        if (userDTO != null) {
            if (userDTO.getId() != null) {
                userEntity.setId(userDTO.getId());
            }
            userEntity.setFullName(userDTO.getFullName());
            userEntity.setEmail(userDTO.getEmail());
            userEntity.setPassword(userDTO.getPassword());
            userEntity.setAvatar(userDTO.getAvatar());
            userEntity.setRole(userDTO.getRole());
            if (userDTO.getCreatedAt() != null) {
                userEntity.setCreatedAt(userDTO.getCreatedAt());
            }
            userEntity.setLogin_times(userDTO.getLogin_times());
        }
        return userEntity;
    }

    public UserDTO toDtoNotHidePassword(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();
        if (userEntity.getId() != null) {
            userDTO.setId(userEntity.getId());
        }
        userDTO.setFullName(userEntity.getFullName());
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setPassword(userEntity.getPassword());
        userDTO.setAvatar(userEntity.getAvatar());
        userDTO.setRole(userEntity.getRole());
        userDTO.setCreatedAt(userEntity.getCreatedAt());
        userDTO.setLogin_times(userEntity.getLogin_times());
        return userDTO;
    }
}
