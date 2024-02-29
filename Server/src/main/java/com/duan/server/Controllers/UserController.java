package com.duan.server.Controllers;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.LoginDto;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Request.ChangePasswordRequest;
import com.duan.server.Response.CodeAndMessage;
import com.duan.server.Response.ResponseUser;
import com.duan.server.Services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/user")
@Transactional
public class UserController {
    @Autowired
    private IUserService userService;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO userDTO1 = userService.persist(userDTO);
            if (userDTO1 != null) {

                ResponseUser ru = new ResponseUser();
                ru.setCode(0); //success
                ru.setMessage("Register user successfully");
                ru.setUserDTO(userDTO1);
                return new ResponseEntity<>(ru, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1);
                cm.setMessage("Fail caused invalid email and password");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            UserDTO userDTO = userService.findUserByEmailAndPassword(loginDto.getEmail(),
                    loginDto.getPassword());
            if (userDTO.getId() != null) {
                ResponseUser ru = new ResponseUser();
                ru.setCode(0); //success
                ru.setMessage("login successfully");
                ru.setUserDTO(userDTO);
                return new ResponseEntity<>(ru, HttpStatus.OK);
            } else {
                CodeAndMessage cm = new CodeAndMessage();
                cm.setCode(1); //invalid email, password
                cm.setMessage("invalid email and password");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @GetMapping("/logout") //remove token
    public ResponseEntity<CodeAndMessage> logout() {
        ResponseEntity<CodeAndMessage> res = null;
        CodeAndMessage ru = new CodeAndMessage();
        try {
            ru.setCode(0); //success
            ru.setMessage("logout successfully");
            res = new ResponseEntity<>(ru, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return res;
    }

    @GetMapping("/get-info")
    public ResponseEntity<?> getUserInfoByEmail() {
        UserDTO userDTO = userService.findUserByEmail();

        return userDTO != null ?
                new ResponseEntity<>(userDTO, HttpStatus.OK) :
                new ResponseEntity<>(new CodeAndMessage(1,
                        "Not found user with email = "+ userDTO.getEmail()),
                        HttpStatus.BAD_REQUEST);
    }
    @GetMapping("/get-detail-by-admin/{email}")
    public ResponseEntity<?> getInfoUserByAdmin(@PathVariable("email") String email) {
        UserDTO userDTO = userService.getDetailUserByAdmin(email);

        return userDTO != null ?
                new ResponseEntity<>(userDTO, HttpStatus.OK) :
                new ResponseEntity<>(new CodeAndMessage(1, "Not found user with email = "+ email), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/change-password/{email}")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @PathVariable("email") String email) {

        CodeAndMessage cm = new CodeAndMessage();

        try {
            if (userService.updatePassword(email, request.getOldPassword(), request.getNewpassword())) {
                cm.setCode(0); //invalid email, password
                cm.setMessage("Change password successfully");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            } else {
                cm.setCode(1); //invalid email, password
                cm.setMessage("Cannot change password");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{email}")
    public ResponseEntity<?> changeSomeData(
            @RequestBody Map<Object, Object> updates,
            @PathVariable("email") String email) {

        CodeAndMessage cm = new CodeAndMessage();

        try {
            if (userService.updateSomeData(email, updates)) {
                cm.setCode(0); //invalid email, password
                cm.setMessage("Change data successfully");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            } else {
                cm.setCode(1); //invalid email, password
                cm.setMessage("Cannot change data");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteAccount(
            @PathVariable("email") String email) {

        CodeAndMessage cm = new CodeAndMessage();

        try {
            if (userService.deleteAccount(email)) {
                cm.setCode(0); //invalid email, password
                cm.setMessage("Delete account successfully");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            } else {
                cm.setCode(1); //invalid email, password
                cm.setMessage("Cannot delete account password");
                return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/upload")
    public ResponseEntity<?> uploadAvatarUser(@RequestPart("avatar") MultipartFile image,
                                              @RequestParam("email") String email){
        try{
            UserDTO userDTO = userService.uploadAvatarUserByEmail(email,image);

            return userDTO != null ?
                    new ResponseEntity<>(new ResponseUser(0,"Upload avatar successful",userDTO), HttpStatus.OK) :
                    new ResponseEntity<>(new CodeAndMessage(1,
                            "Not found user or the authorization is not correct account")
                            , HttpStatus.BAD_REQUEST);

        }catch (Exception e){
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("Fail to upload avatar of user!!" +
                            "Upload fail cause email is not exist or image is too large or Invalid image file format.\" +\n" +
                            "!! please try again")
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all-event-saved")
    public ResponseEntity<?> seeEventsSaved(){
        try{
            Set<EventDTO> lstEventSaved = userService.seeAllEventsSavedOfUser();

            return !lstEventSaved.isEmpty() ?
                    new ResponseEntity<>(lstEventSaved, HttpStatus.OK) :
                    new ResponseEntity<>(new CodeAndMessage(1,
                            "No event saved!!")
                            , HttpStatus.BAD_REQUEST);

        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("error from server, please try again!!")
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/save-event")
    public ResponseEntity<?> saveEvent(
            @Param("idEvent") int idEvent
    ){
        try{
            UserDTO userDTO = userService.saveEventIntoEventSaveListByUser(idEvent);

            return userDTO != null ?
                    new ResponseEntity<>(new ResponseUser(0,"save event successful",userDTO), HttpStatus.OK) :
                    new ResponseEntity<>(new CodeAndMessage(1,
                            "cannot save event because event is exist in your saved list or event does not exist")
                            , HttpStatus.BAD_REQUEST);

        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("error from server, please try again!!")
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/remove-event")
    public ResponseEntity<?> removeEvent(
            @Param("idEvent") int idEvent
    ){
        try{
            UserDTO userDTO = userService.removeEventFromEventSavedList(idEvent);

            return userDTO != null ?
                    new ResponseEntity<>(new ResponseUser(0,"remove event successful",userDTO), HttpStatus.OK) :
                    new ResponseEntity<>(new CodeAndMessage(1,
                            "cannot remove event because event is not exist in your saved list or event does not exist")
                            , HttpStatus.BAD_REQUEST);

        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(CodeAndMessage.builder()
                    .code(1)
                    .message("error from server, please try again!!")
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}