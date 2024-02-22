package com.duan.server.Response;

import com.duan.server.DTO.CategoryDTO;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ResponseCategory {
    private int code;
    private String message;
    private CategoryDTO categoryDTO;
}
