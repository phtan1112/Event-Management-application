package com.duan.server.Request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class RestorePasswordRequest {
    private String email;
    private String password;
}
