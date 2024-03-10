package com.duan.server.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Entity
@Table(name = "tblEvent")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class EventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
            nullable = false,
            unique = true
    )
    private String title;
    private String description;
    private String image1;
    private String image2;
    private String image3;
    private String image4;
    @Column(
            nullable = false
    )
    private String place;

    private Double latitude;
    private Double longitude;
    private Double star;

    @Column(
            nullable = false
    )
    private Boolean cancel; //true or false

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date_start;

    @Column( nullable = false)
    @JsonFormat(pattern = "h:mm")
    private LocalTime time_start;

    @Column(nullable = false)
    @JsonFormat(pattern = "h:mm")
    private LocalTime  time_end;

    @JsonFormat(pattern = "yyyy-MM-dd HH-mm")
    private LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonManagedReference
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    @JsonManagedReference
    private CategoryEntity category;

    @OneToOne(mappedBy = "event", optional = false) //default la eager
    @JsonBackReference
    @ToString.Exclude
    private StatusEntity status;

    @OneToMany(mappedBy = "event") //default la lazy
    @JsonBackReference
    @ToString.Exclude
    private List<CommentEntity> comments = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name="tbl_event_participators",
            uniqueConstraints = {
                    @UniqueConstraint(name="Unique_participation",
                            columnNames = {"event_id","user_id"}
                    )

            },
            joinColumns = {
                    @JoinColumn(name="event_id", referencedColumnName = "id")
            },
            inverseJoinColumns = {
                    @JoinColumn(name="user_id", referencedColumnName = "id")
            }
    )
    @JsonManagedReference
    @ToString.Exclude
    private Set<UserEntity> participators = new HashSet<>();

    //save event
    @ManyToMany(mappedBy = "list_events_saved", fetch = FetchType.LAZY)
    @JsonBackReference
    @ToString.Exclude
    private List<UserEntity> user_saved_event= new ArrayList<>();



    public EventEntity(String title, String description,
                       String image1,
                       String image2,
                       String image3,
                       String image4, String place,
                       Boolean cancel, LocalDate date_start,
                       LocalTime time_start,LocalTime time_end, LocalDateTime createdAt) {
        this.title = title;
        this.description = description;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.image4 = image4;
        this.place = place;
        this.cancel = cancel;
        this.date_start = date_start;
        this.time_start = time_start;
        this.time_end = time_end;
        this.createdAt = createdAt;
    }

}
