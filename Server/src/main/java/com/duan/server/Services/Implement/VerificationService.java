package com.duan.server.Services.Implement;

import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.VerificationCode;
import com.duan.server.Repository.VerificationRepository;
import com.duan.server.Response.CodeAndMessage;
import com.duan.server.Response.ResponseUser;
import com.duan.server.Validators.ValidateEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private MailService mailService;


    @Autowired
    private UserService userService;

    public void saveNewOTP(String email, String otp) {
        verificationRepository.save(new VerificationCode(email, otp, LocalDateTime.now()));
    }

    public Boolean checkOTPIsExpired(String email, String otp) {
        VerificationCode verificationCode = verificationRepository.findByEmailAndOtp(email, otp);

        if(verificationCode!= null){

            Boolean isExpired = checkTokenIsExpiredOrNot(verificationCode.getCreateAt());
            return isExpired;
        }
        return true;
    }
    public ResponseUser checkOTPIsExpiredRegister(String fullName, String email,String password, String otp) {
        VerificationCode verificationCode = verificationRepository.findByEmailAndOtp(email, otp);

        if(verificationCode!= null){
            Boolean isExpired =checkTokenIsExpiredOrNot(verificationCode.getCreateAt());

            if(!isExpired){

               UserDTO userDTO1 = userService.persist(new UserDTO(fullName,email,password));
                if (userDTO1 != null) {
                    ResponseUser ru = new ResponseUser();
                    ru.setCode(0); //success
                    ru.setMessage("Register user successfully");
                    ru.setUser(userDTO1);
                    return ru;
                } else {
                    ResponseUser ru = new ResponseUser();
                    ru.setCode(1); //success
                    ru.setMessage("Email is exist before!!");
                    ru.setUser(null);
                    return ru;
                }
            }
        }
        ResponseUser ru = new ResponseUser();
        ru.setCode(2); //success
        ru.setMessage("The verification code is not valid!!");
        ru.setUser(null);
        return ru;
    }
    public Boolean checkTokenIsExpiredOrNot(LocalDateTime createAt){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime afterPlusSeconds = createAt.plusSeconds(60);
        return now.isAfter(afterPlusSeconds);
    }
    public ResponseUser checkOTPIsExpiredRestorePassword(String email,String password, String otp) { //
        VerificationCode verificationCode = verificationRepository.findByEmailAndOtp(email, otp);

        if(verificationCode!= null){

            Boolean isExpired = checkTokenIsExpiredOrNot(verificationCode.getCreateAt());



            if(!isExpired){
                UserDTO userDTO = userService.restorePassword(email,password);
                if (userDTO != null) {
                    ResponseUser ru = new ResponseUser();
                    ru.setCode(0); //success
                    ru.setMessage("Restore password of user successfully");
                    ru.setUser(userDTO);
                    return ru;
                }
                else {
                    ResponseUser ru = new ResponseUser();
                    ru.setCode(1); //fail cause password
                    ru.setMessage("Your password is not enough 6 digits!!");
                    ru.setUser(null);
                    return ru;
                }
            }
        }
        ResponseUser ru = new ResponseUser();
        ru.setCode(2); //success
        ru.setMessage("The verification code is not valid!!");
        ru.setUser(null);
        return ru;
    }
    private String generateTo6NumberRandom() {
        Random random = new Random();
        StringBuilder number = new StringBuilder();
        for (int i = 1; i <= 6; i++) {
            number.append(random.nextInt(1, 10));
        }
        return number.toString();
    }

    public Boolean sendVerificationCode(String email, Integer type) {
        String otp = generateTo6NumberRandom();
        if (ValidateEmail.validateEmail(email)) {
           if(type == 1){ //register
               if(userService.findUserByEmail(email) == null){
                   mailService.sendVerificationCode(email, otp);
                   saveNewOTP(email,otp);
                   return true;
               }
               return false;
           }
            if(type == 2){ //restore
                if(userService.findUserByEmail(email) != null){
                    mailService.sendVerificationCode(email, otp);
                    saveNewOTP(email,otp);
                    return true;
                }
                return false;
            }

        }

        return false;
    }
    public List<VerificationCode> getAll(){
        return verificationRepository.findAll();
    }
    public void deleteAllOTP(List<VerificationCode> list){
        verificationRepository.deleteAll(list);
    }

}
