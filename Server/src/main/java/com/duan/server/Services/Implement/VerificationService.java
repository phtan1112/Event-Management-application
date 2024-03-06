package com.duan.server.Services.Implement;

import com.duan.server.Models.VerificationCode;
import com.duan.server.Repository.VerificationRepository;
import com.duan.server.Validators.ValidateEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private MailService mailService;


    public void saveNewOTP(String email, String otp) {
        verificationRepository.save(new VerificationCode(email, otp, LocalTime.now(), false));
    }

    public Boolean checkOTPIsExpired(String email, String otp) {
        VerificationCode verificationCode = verificationRepository.findByEmailAndOtp(email, otp);

        if(verificationCode!= null){
            Boolean isExpired = verificationCode.getIsExpired();
            changeToExpired(verificationCode.getId());
            return isExpired;
        }
        return true;
    }

    public void changeToExpired(Integer id) {
        VerificationCode verificationCode = verificationRepository.findById(id).orElse(null);
        if (verificationCode != null) {
            verificationCode.setIsExpired(true);
            verificationRepository.save(verificationCode);
        }
    }

    private String generateTo6NumberRandom() {
        Random random = new Random();
        StringBuilder number = new StringBuilder();
        for (int i = 1; i <= 6; i++) {
            number.append(random.nextInt(1, 10));
        }
        return number.toString();
    }

    public Boolean sendVerificationCode(String email) {
        String otp = generateTo6NumberRandom();
        if (ValidateEmail.validateEmail(email)) {
            saveNewOTP(email,otp);
            mailService.sendVerificationCode(email, otp);

            return true;
        }

        return false;
    }
    public List<VerificationCode> getAll(Boolean isExpired){
        return verificationRepository.findAllByIsExpired(isExpired);
    }
    public void deleteAllOTP(List<VerificationCode> list){
        verificationRepository.deleteAll(list);
    }

}
