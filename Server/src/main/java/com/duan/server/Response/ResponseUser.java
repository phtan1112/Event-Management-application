package com.duan.server.Response;

import com.duan.server.DTO.UserDTO;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ResponseUser {
    private int code;
    private String message;
    private UserDTO userDTO;

}
