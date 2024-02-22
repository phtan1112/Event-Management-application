package com.duan.server.Request;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class EventRequest {
    private String title;
    private String description;
    private String place;
    private Boolean cancel; //true or false
    private LocalDate time_start;
    private LocalDate  time_end;
    private String user_email;
    private String typeOfEvent;
}
