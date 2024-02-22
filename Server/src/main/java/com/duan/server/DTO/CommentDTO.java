package com.duan.server.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class CommentDTO {
    private Integer id;
    private String content;
    private int star;
    private LocalDateTime createdAt;
    private UserDTO user;
    private EventDTO event;

    public CommentDTO(String content, int star,  UserDTO user, EventDTO event) {
        this.content = content;
        this.star = star;
        this.user = user;
        this.event = event;
    }
}
