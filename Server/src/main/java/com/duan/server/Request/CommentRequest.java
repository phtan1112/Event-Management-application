package com.duan.server.Request;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class CommentRequest {
    private String content;
    private int star;
    private int event_id;
}
