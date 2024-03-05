package com.duan.server.Services.Implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailOwner;

    public void sendMail(String toMail,String verifyCode){
        String name = toMail.split("@")[0];
        String textBlockRender ="""
                Hi %s,
                We received your request for getting verify the account in Event-Management.
                Your verification code is: %s.
                The expiration of this code is 60 seconds.
                """ ;
        String text =String.format((textBlockRender) + "%n",name,verifyCode);
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(mailOwner);
        simpleMailMessage.setSubject("Your Verification Code");
        simpleMailMessage.setText(text);
        simpleMailMessage.setTo(toMail);

        mailSender.send(simpleMailMessage);
    }

}
