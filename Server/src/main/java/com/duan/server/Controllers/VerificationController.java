package com.duan.server.Controllers;

import com.duan.server.Services.Implement.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/verify")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;
    @GetMapping("/send-otp")
    public ResponseEntity<?> sendOTP(@RequestParam("email") String email){
        if (verificationService.sendVerificationCode(email)){
            return new ResponseEntity<>(new HashMap<>().put("Message","Send verification successful"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new HashMap<>().put("Message","Send verification fail"), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/check-otp")
    public ResponseEntity<?> checkOTP(
            @RequestParam("email") String email,
            @RequestParam("code") Integer otp
    ){
        if(!verificationService.checkOTPIsExpired(email,otp.toString())){
            return new ResponseEntity<>("Valid", HttpStatus.OK);

        }
        return new ResponseEntity<>("Invalid", HttpStatus.BAD_REQUEST);
    }

}
