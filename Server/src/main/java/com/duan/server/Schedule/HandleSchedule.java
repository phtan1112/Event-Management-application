package com.duan.server.Schedule;

import com.duan.server.Configurations.Security.JWTService;
import com.duan.server.DTO.EventDTO;
import com.duan.server.Models.Token;
import com.duan.server.Models.VerificationCode;
import com.duan.server.Services.Implement.EventService;
import com.duan.server.Services.Implement.TokenService;
import com.duan.server.Services.Implement.VerificationService;
import org.aspectj.lang.annotation.AdviceName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@EnableAsync
public class HandleSchedule { // the task will run parallel in schedule tasks.
    @Autowired
    private EventService eventService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private VerificationService verificationService;

    //auto change status when the status is start.
    @Async
    @Scheduled(fixedRate = 5000) //5s will call the method below once.
    public void scheduleFixedRateTaskAsync() throws InterruptedException {
        List<EventDTO> allEvents = eventService.getAllEventsByStatusEndedIsFalse();
        LocalDate currentDate = LocalDate.now(); //2024-02-13
        LocalTime currentTime = LocalTime.now(); // 14:24:32.699555900

        for (EventDTO eventDTO : allEvents) {

            LocalDate TARGET_DATE_START = LocalDate.of(
                    eventDTO.getDate_start().getYear(),
                    eventDTO.getDate_start().getMonth(),
                    eventDTO.getDate_start().getDayOfMonth());

            LocalTime TARGET_TIME_START = LocalTime.of(
                    eventDTO.getTime_start().getHour(),
                    eventDTO.getTime_start().getMinute());

            LocalTime TARGET_TIME_END = LocalTime.of(
                    eventDTO.getTime_end().getHour(),
                    eventDTO.getTime_end().getMinute());

            if (currentDate.isEqual(TARGET_DATE_START)) { // event da toi ngay
                //handle changing from created to operating
                if (!eventService.findStatusByEvent(eventDTO.getId()).getOperating()
                        &&
                        currentTime.isAfter(TARGET_TIME_START)) {

                    Map<Object, Object> fields = new HashMap<>();
                    fields.put("operating", true);
                    eventService.changeStatusEventByIdEventForSchedule(eventDTO, fields);
                }
                //handle changing from operating to ended
                if (currentTime.isAfter(TARGET_TIME_END)) {
                    Map<Object, Object> fields = new HashMap<>();
                    fields.put("ended", true);
                    eventService.changeStatusEventByIdEventForSchedule(eventDTO, fields);
                }
            }
        }
        Thread.sleep(2000);
    }

    //handle 1am everyday
    // so this method below will check whether the token's user is expired or revoked or not
    // if yes, the method will remove it permanent the database
    //for saving the database memory and increasing performance query for the database.
    @Async
    @Scheduled(cron = "0 0 1 ? * SUN") // 1am every sunday
    // (cron = "0 40 15 * * *") second - minute - hour - day in month - month - day in week)
    public void removeTokenIsExpiredByCheckJWT() {
        List<Token> lst_token = tokenService.getAllTokens();
        lst_token.forEach(token -> {
            if (jwtService.isTokenExpired(token.getToken())) {
                tokenService.deleteTokenFromDatabase(token);
            }
        });
        System.out.println("------------------CLEAR TOKEN EXPIRED SUCCESSFULLY------------------");
        System.out.println("------------------DATE: " + LocalDateTime.now() + " --------------------");
    }

    @Async
    @Scheduled(fixedRate = 1000) // every second, the method will check the otp code is expired or not.
    public void changeOTPExpired() {
        List<VerificationCode> lst_otp = verificationService.getAll(false);
        if(!lst_otp.isEmpty()){
            lst_otp.forEach(otp -> {
                if (checkExpiredOTP(otp.getCreateAt())) {
                    verificationService.changeToExpired(otp.getId());
                }
            });
        }
    }
    private Boolean checkExpiredOTP(LocalTime createAt){
        LocalTime currentTime = LocalTime.now();
        if(currentTime.isAfter(createAt.plusSeconds(60))){
            return true;
        }
        return false;
    }

    @Async
    @Scheduled(cron = "0 0 2 ? * SUN") // 2am every sunday
    // (cron = "0 40 15 * * *") second - minute - hour - day in month - month - day in week)
    public void deleteOTPExpired() {
        List<VerificationCode> lst_otp = verificationService.getAll(true);
        if(!lst_otp.isEmpty()){
            verificationService.deleteAllOTP(lst_otp);
        }
        System.out.println("------------------CLEAR VERIFICATION CODE EXPIRED SUCCESSFULLY------------------");
        System.out.println("------------------DATE: " + LocalDateTime.now() + " --------------------");
    }
}
