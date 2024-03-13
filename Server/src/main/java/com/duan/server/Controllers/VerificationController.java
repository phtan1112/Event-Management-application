package com.duan.server.Controllers;

import com.duan.server.Response.CodeAndMessage;
import com.duan.server.Response.ResponseUser;
import com.duan.server.Services.Implement.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;


@RestController
@RequestMapping("/api/v1/verify")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @GetMapping("/send-otp")
    public ResponseEntity<?> sendOTP(
            @RequestParam("email") String email,
            @RequestParam("type") Integer type
            ) {
        CodeAndMessage cm = new CodeAndMessage();
        if(type ==1){ //register
            if (verificationService.sendVerificationCode(email,type)) {
                cm.setCode(0);
                cm.setMessage("Send verification successfully");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            }
            cm.setCode(1);
            cm.setMessage("Your email is exist before!!");
            return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
        }
        if(type ==2){ //restore
            if (verificationService.sendVerificationCode(email,type)) {
                cm.setCode(0);
                cm.setMessage("Send verification successfully");
                return new ResponseEntity<>(cm, HttpStatus.OK);
            }
            cm.setCode(1);
            cm.setMessage("Your email is not exist!!");
            return new ResponseEntity<>(cm, HttpStatus.BAD_REQUEST);
        }
        cm.setCode(2);
        cm.setMessage("Type in param is invalid!!");
        return new ResponseEntity<>(cm, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @GetMapping("/check-otp")
    public ResponseEntity<?> checkOTP(
            @RequestParam("email") String email,
            @RequestParam("code") Integer otp
    ) {
        if (!verificationService.checkOTPIsExpired(email, otp.toString())) {
            return new ResponseEntity<>("Valid", HttpStatus.OK);

        }
        return new ResponseEntity<>("Invalid", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/check-otp-register")
    public ResponseEntity<?> checkOTP(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("code") Integer otp
    ) {
        ResponseUser ru =verificationService.checkOTPIsExpiredRegister(fullName,email,password, otp.toString());
        if (ru.getCode() == 0) {
            return new ResponseEntity<>(ru, HttpStatus.OK);
        }
        return new ResponseEntity<>(ru, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/check-otp-restore")
    public ResponseEntity<?> checkOTP(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("code") Integer otp
    ) {
        ResponseUser ru =verificationService.checkOTPIsExpiredRestorePassword(email,password, otp.toString());
        if (ru.getCode() == 0) {
            return new ResponseEntity<>(ru, HttpStatus.OK);

        }
        return new ResponseEntity<>(ru, HttpStatus.BAD_REQUEST);
    }

}
