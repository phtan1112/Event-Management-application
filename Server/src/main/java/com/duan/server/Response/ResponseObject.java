package com.duan.server.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ResponseObject {
    private int code;
    private String message;
    private Object object;
}
