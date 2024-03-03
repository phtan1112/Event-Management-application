package com.duan.server.Services;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.StatusDTO;
import com.duan.server.Models.StatusEntity;

import java.util.Map;

public interface IStatusService {
    StatusDTO generate(StatusDTO statusDTO);

    StatusDTO getStatusByEvent(EventDTO eventDTO);

    StatusEntity changeStatusOfEvent(StatusEntity statusEntity, Map<Object, Object> fields);

    Boolean deleteStatusByEvent(EventDTO eventDTO);

}
