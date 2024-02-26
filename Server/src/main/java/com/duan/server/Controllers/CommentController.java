package com.duan.server.Controllers;

import com.duan.server.DTO.CommentDTO;
import com.duan.server.Request.CommentRequest;
import com.duan.server.Response.CodeAndMessage;
import com.duan.server.Services.Implement.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comment")
@Transactional
public class CommentController {
    @Autowired
    private CommentService commentService;


    @PostMapping("/new-comment")
    public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest){
        try{
            CommentDTO commentDTO = commentService.persistNewComment(commentRequest);
            if(commentDTO != null){
                return new ResponseEntity<>(commentDTO, HttpStatus.OK);
            }
            else{
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to comment because your content is empty or star is not in 0 to 5 or you do not participate the event!!");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);

            }
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
