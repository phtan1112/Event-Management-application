package com.duan.server.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class CodeAndMessage {
    private int code;
    private String message;
}
