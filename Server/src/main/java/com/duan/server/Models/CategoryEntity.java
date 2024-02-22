package com.duan.server.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name ="tblCategory")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class CategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
            unique = true,
            nullable = false
    )
    private String thumbnail;

    @Column(
            name = "type_event",
            nullable = false,
            unique = true
    )
    private String typeOfEvent;


    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY) //default la lazy
    @JsonBackReference
    @ToString.Exclude
    private List<EventEntity> events = new ArrayList<>();
}
