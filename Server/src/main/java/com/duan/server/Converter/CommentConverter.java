package com.duan.server.Converter;

import com.duan.server.DTO.CommentDTO;
import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.CommentEntity;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import com.duan.server.Response.CommentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CommentConverter {
    @Autowired
    private UserConverter userConverter;
    @Autowired
    private EventConverter eventConverter;

    public List<CommentDTO> convertListCommentOfEventToDTO(List<CommentEntity> commentEntityList){
        return commentEntityList
                .stream()
                .map(c-> toDto(c))
                .collect(Collectors.toList());
    }
    public List<CommentEntity> convertListCommentOfEventToEntity(List<CommentDTO> commentDTOList){
        return commentDTOList
                .stream()
                .map(c-> toEntity(c))
                .collect(Collectors.toList());
    }

    public List<CommentResponse> convertListCommentOfEventToCommentResponseDTO(List<CommentEntity> commentEntityList){
        return commentEntityList
                .stream()
                .map(c->CommentResponse
                        .builder()
                        .id(c.getId())
                        .content(c.getContent())
                        .star(c.getStar())
                        .createdAt(c.getCreatedAt())
                        .user(userConverter.toDto(c.getUser()))
                        .build())
                .collect(Collectors.toList());
        //test git again
    }
    public CommentEntity toEntity(CommentDTO commentDTO){
        CommentEntity commentEntity = new CommentEntity();
        if(commentDTO.getId()!=null){
            commentEntity.setId(commentDTO.getId());
        }
        commentEntity.setContent(commentDTO.getContent());
        commentEntity.setStar(commentDTO.getStar());
        commentEntity.setCreatedAt(commentDTO.getCreatedAt());
        commentEntity.setUser(userConverter.toEntity(commentDTO.getUser()));
        commentEntity.setEvent(eventConverter.toEntity(commentDTO.getEvent()));

        return commentEntity;
    }

    public CommentDTO toDto(CommentEntity commentEntity){
        return CommentDTO
                .builder()
                .id(commentEntity.getId())
                .content(commentEntity.getContent())
                .star(commentEntity.getStar())
                .createdAt(commentEntity.getCreatedAt())
                .user(userConverter.toDto(commentEntity.getUser()))
                .event(eventConverter.toDTO(commentEntity.getEvent()))
                .build();
    }
}
