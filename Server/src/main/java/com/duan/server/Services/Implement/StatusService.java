package com.duan.server.Services.Implement;

import com.duan.server.Converter.EventConverter;
import com.duan.server.Converter.StatusConverter;
import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.StatusDTO;
import com.duan.server.Models.StatusEntity;
import com.duan.server.Repository.StatusRepository;
import com.duan.server.Services.IStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.Map;

@Service
public class StatusService implements IStatusService {
    @Autowired
    private StatusRepository statusRepository;
    @Autowired
    private StatusConverter statusConverter;
    @Autowired
    private EventConverter eventConverter;


    @Override
    public StatusDTO generate(StatusDTO statusDTO) {
        StatusEntity statusEntity = statusConverter.toEntity(statusDTO);
        statusEntity = statusRepository.save(statusEntity);
        return statusConverter.toDto(statusEntity);
    }

    @Override
    public StatusDTO getStatusByEvent(EventDTO eventDTO) {
        StatusEntity statusEntity = statusRepository.findByEvent(eventConverter.toEntity(eventDTO));

        return statusConverter.toDto(statusEntity);
    }

    @Override
    public StatusEntity changeStatusOfEvent(StatusEntity statusEntity, Map<Object, Object> fields) {
        fields.forEach((key, value) -> {
            String keyParse = (String) key;
            Field field = ReflectionUtils.findField(StatusEntity.class, keyParse);
            field.setAccessible(true);
            ReflectionUtils.setField(field, statusEntity, value);
        });
        StatusEntity statusEntity1 = statusRepository.save(statusEntity);
        return statusEntity1;
    }


}
