package com.duan.server.Services;

import com.duan.server.DTO.CommentDTO;
import com.duan.server.Request.CommentRequest;

public interface ICommentService {
    CommentDTO persistNewComment(CommentRequest commentRequest);
}
