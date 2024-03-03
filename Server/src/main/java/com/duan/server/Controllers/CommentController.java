package com.duan.server.Controllers;

import com.duan.server.DTO.CommentDTO;
import com.duan.server.Request.CommentRequest;
import com.duan.server.Response.CodeAndMessage;
import com.duan.server.Services.Implement.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
                cm.setMessage("Fail to comment " +
                        "because your content is empty or star is not in 0 to 5" +
                        " or the event is not ended!!");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);

            }
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/edit-comment/{id}")
    public ResponseEntity<?> editComment(
            @PathVariable("id") Integer idComment,
            @RequestBody CommentRequest commentRequest){
        try{
            CommentDTO commentDTO = commentService.updateComment(commentRequest, idComment);
            if(commentDTO != null){
                return new ResponseEntity<>(commentDTO, HttpStatus.OK);
            }
            else{
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to update comment with id = " + idComment);
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);

            }
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/remove-comment/{id}")
    public ResponseEntity<?> removeComment(@PathVariable("id") Integer idComment){
        try{
            if(commentService.deleteComment(idComment)){
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(0);
                cm.setMessage("Remove comment with id = " + idComment + " successfully.");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            }
            else{
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail to remove comment with id = " + idComment);
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
