package com.duan.server.Converter;

import com.duan.server.DTO.StatusDTO;
import com.duan.server.Models.StatusEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StatusConverter {
    @Autowired
    private EventConverter eventConverter;


    public StatusEntity toEntity(StatusDTO statusDTO){
        return StatusEntity
                .builder()
                .id(statusDTO.getId() != null ?  statusDTO.getId() : null)
                .created(statusDTO.getCreated())
                .operating(statusDTO.getOperating())
                .ended(statusDTO.getEnded())
                .event(eventConverter.toEntity(statusDTO.getEvent()))
                .build();
    }

    public StatusDTO toDto(StatusEntity statusEntity){
        return StatusDTO
                .builder()
                .id(statusEntity.getId() != null ?  statusEntity.getId() : null)
                .created(statusEntity.getCreated())
                .operating(statusEntity.getOperating())
                .ended(statusEntity.getEnded())
                .event(eventConverter.toDTO(statusEntity.getEvent()))
                .build();
    }
}
