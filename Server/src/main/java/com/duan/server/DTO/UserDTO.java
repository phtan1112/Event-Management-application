package com.duan.server.DTO;

import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserDTO {
    private Integer id;
    private String fullName;
    private String email;
    private String password;
    private String avatar;
    private Integer birthYear;
    private String role;
    private LocalDate createdAt;
    private int login_times;
    private Set<EventDTO> list_events_saved = new HashSet<>();
    private String token;
    public void addEventToSaveList(EventDTO e){
        if(list_events_saved == null){
            this.list_events_saved = new HashSet<>();
        }
        this.list_events_saved.add(e);
    }

    public UserDTO(String fullName, String email, String password, Integer birthYear) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.birthYear = birthYear;
    }


}
