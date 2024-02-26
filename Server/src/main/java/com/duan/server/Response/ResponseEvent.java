package com.duan.server.Response;

import com.duan.server.DTO.CategoryDTO;
import com.duan.server.DTO.CommentDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.CommentEntity;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
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
@Builder
public class ResponseEvent {
    private Integer id;
    private String title;
    private String description;
    private String image1;
    private String image2;
    private String image3;
    private String image4;
    private String place;
    private int star;
    private Double latitude;
    private Double longitude;
    private Boolean cancel; //true or false
    private LocalDate date_start;
    private LocalTime time_start;
    private LocalTime  time_end;
    private LocalDate  createAt;
    private UserDTO user;
    private CategoryDTO category;
    private ResponseStatus status;
    private int numberOfParticipators;
    private Set<UserDTO> participators = new HashSet<>();
    private List<CommentResponse> comments = new ArrayList<>();
}
