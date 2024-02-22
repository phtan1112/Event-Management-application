package com.duan.server.Models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name ="tblStatus")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class StatusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
            nullable = false
    )
    private Boolean created;

    @Column(
            nullable = false
    )
    private Boolean operating;

    @Column(
            nullable = false
    )
    private Boolean ended;

    @OneToOne
    @JoinColumn(name = "event_id")
    @JsonManagedReference
    private EventEntity event;

    public StatusEntity(Boolean created, Boolean operating, Boolean ended) {
        this.created = created;
        this.operating = operating;
        this.ended = ended;
    }
}
