package com.duan.server.DTO;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class StatusDTO {
    private Integer id;
    private Boolean created;
    private Boolean operating;
    private Boolean ended;
    private EventDTO event;

    public StatusDTO(Boolean created, Boolean operating, Boolean ended, EventDTO event) {
        this.created = created;
        this.operating = operating;
        this.ended = ended;
        this.event = event;
    }
}
