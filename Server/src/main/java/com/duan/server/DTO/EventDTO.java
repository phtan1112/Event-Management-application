package com.duan.server.DTO;
import com.duan.server.Models.CategoryEntity;
import com.duan.server.Models.CommentEntity;
import com.duan.server.Models.UserEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class EventDTO {
    private Integer id;
    private String title;
    private String description;
    private String image1;
    private String image2;
    private String image3;
    private String image4;
    private String place;
    private Double latitude;
    private Double longitude;
    private Double star;
    private Boolean cancel; //true or false
    private LocalDate date_start;
    private LocalTime time_start;
    private LocalTime  time_end;
    private LocalDate createdAt;
    private UserDTO user;
    private CategoryDTO category;
    private StatusDTO status;
    private Set<UserDTO> participators;
    private List<CommentDTO> comments = new ArrayList<>();
    private List<UserEntity> user_saved_event= new ArrayList<>();

    public void addUserDTO(UserDTO e){
        if(participators == null){
            this.participators = new HashSet<>();
        }
        this.participators.add(e);
    }
    public void removeUserToParticipatorsList(UserDTO u){
        if(participators == null){
            this.participators = new HashSet<>();
        }
        participators.removeIf(p -> Objects.equals(p.getId(), u.getId()));
    }
    public EventDTO(String title,
                    String description,
                    String image1,
                    String image2,
                    String image3,
                    String image4,
                    String place,Double latitude,Double longitude,
                    Boolean cancel, LocalDate date_start,
                    LocalTime time_start,LocalTime  time_end,
                    LocalDate createdAt, UserDTO user, CategoryDTO category) {
        this.title = title;
        this.description = description;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.image4 = image4;
        this.place = place;
        this.latitude = latitude;
        this.longitude = longitude;
        this.cancel = cancel;
        this.date_start = date_start;
        this.time_start = time_start;
        this.time_end = time_end;
        this.createdAt = createdAt;
        this.user = user;
        this.category = category;
    }
}
