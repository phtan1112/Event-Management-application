package com.duan.server.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ResponseStatus {
    private Boolean created;
    private Boolean operating;
    private Boolean ended;
}
