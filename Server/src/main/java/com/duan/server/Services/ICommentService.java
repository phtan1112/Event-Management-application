package com.duan.server.Services;

import com.duan.server.DTO.CommentDTO;
import com.duan.server.DTO.EventDTO;
import com.duan.server.Request.CommentRequest;
import org.apache.commons.math3.genetics.Fitness;

public interface ICommentService {
    CommentDTO persistNewComment(CommentRequest commentRequest);
    CommentDTO updateComment(CommentRequest commentRequest, Integer idComment);
    Boolean deleteComment(int idComment);

    Boolean deleteCommentByEvent(EventDTO eventDTO);
}
