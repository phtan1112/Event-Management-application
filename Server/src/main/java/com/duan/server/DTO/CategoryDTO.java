package com.duan.server.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class CategoryDTO {
    private Integer id;
    private String thumbnail;
    private String typeOfEvent;

    public CategoryDTO(String thumbnail, String typeOfEvent) {
        this.thumbnail = thumbnail;
        this.typeOfEvent = typeOfEvent;
    }
}
