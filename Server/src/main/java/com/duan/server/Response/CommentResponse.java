package com.duan.server.Response;


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
public class CommentResponse {
    private Integer id;
    private String content;
    private int star;
    private LocalDateTime createdAt;
    private UserDTO user;
}
