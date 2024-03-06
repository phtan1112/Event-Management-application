package com.duan.server.Services.Implement;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
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

    private void sendMail(String toMail,String text,String subject){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(mailOwner);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(text);
        simpleMailMessage.setTo(toMail);
        mailSender.send(simpleMailMessage);
    }

    public void sendVerificationCode(String toMail,String verifyCode){
            String name = toMail.split("@")[0];
            String textBlockRender =
                    """
                    Hi %s,
                    We received your request for verification your email in Event-Management application.
                    Your verification code is: %s.
                    The expiration of this code is 60 seconds.
                    
                    
                    Best-Regards,
                    Event-Management Support Team
                    """
                    ;
            String text =String.format((textBlockRender) + "%n",name,verifyCode);
            String subject = "Your Verification Code";
            sendMail(toMail,text,subject);

    }

    public void sendEventSuccessfulCreated(String toMail, EventDTO eventDTO){
        String name = toMail.split("@")[0];
        String textBlockRender =
                """
                Hi %s,
                
                Congratulations! You have successfully created the event. Some information about your new event below:
                
                    Title: %s
                    Description: %s
                    Place: %s
                    Start day: %s
                    Start time: %s
                    End time: %s
                    Created at: %s
                    Type Event: %s
                    
                Hope you enjoy our application.
                If you have any question or need assistance, direct to us at tanphuocdt1@gmail.com or Zalo is 0364429373 (Phuoc Tan).
                
                
                Best Regards,
                Event-Management Support Team
                """
                ;
        String text =String.format((textBlockRender) + "%n",
                name,
                eventDTO.getTitle(),
                eventDTO.getDescription(),
                eventDTO.getPlace(),
                eventDTO.getDate_start(),
                eventDTO.getTime_start(),
                eventDTO.getTime_end(),
                eventDTO.getCreatedAt(),
                eventDTO.getCategory().getTypeOfEvent()
                );
        String subject = "Notification: Successful Creation Event";
        sendMail(toMail,text,subject);

    }

    public void sendAccountRegistered(String toMail, UserDTO userDTO){
        String name = toMail.split("@")[0];
        String textBlockRender =
                """
                Hi %s,
                
                Congratulations! Your registration on Event-Management application is now complete.
                Some information about your new account below:
                
                    Full Name: %s
                    Email: %s,
                    Created At: %s
                    
                We're excited to have you on board and look forward to providing you with an excellent experience. Enjoy our application!!
                
                If you have any question or need assistance, direct to us at tanphuocdt1@gmail.com or Zalo is 0364429373 (Phuoc Tan).
                
                
                Best Regards,
                Event-Management Support Team
                """
                ;
        String[] splitCreateAt = userDTO.getCreatedAt().toString().split("T");
        String[] splitTime = splitCreateAt[1].split(":");
        String createAtAfterSplit = splitCreateAt[0] + " At " + splitTime[0] + ":" + splitTime[1] + ":" +
                splitTime[2].split("\\.")[0];


        String text =String.format((textBlockRender) + "%n",
                name,
                userDTO.getFullName(),
                userDTO.getEmail(),
                createAtAfterSplit

        );
        String subject = "Notification: Account Registered Successfully";
        sendMail(toMail,text,subject);

    }

}
