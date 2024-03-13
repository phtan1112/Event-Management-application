package com.duan.server.Services.Implement;

import com.duan.server.Converter.CommentConverter;
import com.duan.server.Converter.EventConverter;
import com.duan.server.Converter.UserConverter;
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
import java.util.ArrayList;
import java.util.List;

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

    @Autowired
    private EventConverter eventConverter;

    @Autowired
    private UserConverter userConverter;


    @Override
    public CommentDTO persistNewComment(CommentRequest commentRequest) {

        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);

        EventDTO eventDTO = eventService.findById(commentRequest.getEvent_id());

        if (eventDTO != null) { // allow comment when event is ended
            StatusDTO statusDTO = eventService.findStatusByEvent(eventDTO.getId());
            if (!commentRequest.getContent().equals("") &&
                    commentRequest.getStar() > 0 &&
                    commentRequest.getStar() <= 5
                    && statusDTO.getEnded()
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
                CommentDTO commentDTO = commentConverter.toDto(commentEntity);
                commentDTO.setEvent(eventService.findById(eventDTO.getId()));

                commentDTO.getEvent().getUser().setPassword("*************");

                for (UserDTO userDTO1 : commentDTO.getEvent().getParticipators()) {
                    userDTO1.setPassword("********");
                }

                return commentDTO;
            }

        }
        return null;
    }

    @Override
    public CommentDTO updateComment(CommentRequest commentRequest, Integer idComment) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        CommentEntity commentEntity =
                commentRepository.findByIdAndUser(
                        idComment,
                        userConverter.toEntity(userDTO)).orElse(null);
        if (commentEntity != null) {
            if (!commentRequest.getContent().equals("") &&
                    commentRequest.getStar() > 0 &&
                    commentRequest.getStar() <= 5
            ) {
                commentEntity.setContent(commentRequest.getContent());
                commentEntity.setStar(commentRequest.getStar());
                commentEntity = commentRepository.save(commentEntity);
                eventService.calculateStarOfEvent(commentEntity.getEvent().getId());
                CommentDTO commentDTO = commentConverter.toDto(commentEntity);
                commentDTO.setEvent(eventConverter.toDTO(commentEntity.getEvent()));
                commentDTO.getEvent().getUser().setPassword("*************");

                for (UserDTO userDTO1 : commentDTO.getEvent().getParticipators()) {
                    userDTO1.setPassword("********");
                }


                return commentDTO;
            }
        }
        return null;
    }

    @Override
    public Boolean deleteComment(int idComment) {
        String email = userService.getUserEmailByAuthorization();
        UserDTO userDTO = userService.findUserByEmail(email);
        CommentEntity commentEntity =
                commentRepository.findByIdAndUser(
                        idComment,
                        userConverter.toEntity(userDTO)).orElse(null);
        if (commentEntity != null) {

            int idEvent =commentEntity.getEvent().getId();
            commentRepository.delete(commentEntity);

            commentEntity.getEvent().getComments().remove(commentEntity);

            eventService.calculateStarOfEvent(idEvent);
            return true;
        }
        return false;
    }

    @Override
    public Boolean deleteCommentByEvent(EventDTO eventDTO) {
        List<CommentEntity> listComments = commentRepository.findAllByEvent(eventConverter.toEntity(eventDTO));
        if(!listComments.isEmpty()){
            listComments.forEach(commentEntity -> commentRepository.delete(commentEntity));
            return true;
        }
        return false;
    }

}
