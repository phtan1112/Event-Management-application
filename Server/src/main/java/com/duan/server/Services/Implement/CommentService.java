package com.duan.server.Services.Implement;

import com.duan.server.Converter.CommentConverter;
import com.duan.server.DTO.CommentDTO;
import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.StatusDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.CommentEntity;
import com.duan.server.Repository.CommentRepository;
import com.duan.server.Request.CommentRequest;
import com.duan.server.Services.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CommentService implements ICommentService {
    @Autowired
    private UserService userService;
    @Autowired
    private EventService eventService;

    @Autowired
    private CommentConverter commentConverter;
    @Autowired
    private CommentRepository commentRepository;


    @Override
    public CommentDTO persistNewComment(CommentRequest commentRequest) {

        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);

        EventDTO eventDTO = eventService.findById(commentRequest.getEvent_id());

        if (eventDTO.getId() != null) { // allow comment when event is ended
            StatusDTO statusDTO = eventService.findStatusByEvent(eventDTO.getId());
            if (!commentRequest.getContent().equals("") &&
                    commentRequest.getStar() > 0 &&
                    commentRequest.getStar() <= 5
                    &&  statusDTO.getEnded()
            ) {
                CommentEntity commentEntity = commentConverter.toEntity(
                        CommentDTO
                                .builder()
                                .content(commentRequest.getContent())
                                .star(commentRequest.getStar())
                                .createdAt(LocalDateTime.now())
                                .user(userDTO)
                                .event(eventDTO)
                                .build()
                );
                commentEntity = commentRepository.save(commentEntity);
                eventService.calculateStarOfEvent(commentRequest.getEvent_id());
                CommentDTO commentDTO =commentConverter.toDto(commentEntity);
                commentDTO.setEvent(eventService.findById(eventDTO.getId()));
                return commentDTO;
            }

        }
        return null;
    }
}
