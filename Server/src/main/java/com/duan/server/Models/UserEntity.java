package com.duan.server.Models;


import com.duan.server.DTO.EventDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.Phaser;

@Entity
@Table(name ="tblUser")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String fullName;
    @Column(unique = true)
    private String email;
    private String password;
    private String avatar;
    private String role;

    @JsonFormat(pattern = "yy-MM-dd HH-mm")
    private LocalDateTime createdAt;
    private int login_times;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY) //default la lazy
    @JsonBackReference
    @ToString.Exclude
    private List<EventEntity> events = new ArrayList<>();



    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY) //default la lazy
    @JsonBackReference
    @ToString.Exclude
    private List<CommentEntity> comments = new ArrayList<>();


    @ManyToMany(mappedBy = "participators", fetch = FetchType.LAZY)
    @JsonBackReference
    @ToString.Exclude
    private List<EventEntity> events_participate= new ArrayList<>();


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name="tbl_save_events",
            uniqueConstraints = {
                    @UniqueConstraint(name="Unique_participation",
                            columnNames = {"user_id","event_id"}
                    )

            },
            joinColumns = {
                    @JoinColumn(name="user_id", referencedColumnName = "id")
            },
            inverseJoinColumns = {
                    @JoinColumn(name="event_id", referencedColumnName = "id")
            }
    )
    @JsonManagedReference
    @ToString.Exclude
    private Set<EventEntity> list_events_saved = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY) //default is lazy
    @JsonBackReference
    @ToString.Exclude
    private Set<Token> tokens = new HashSet<>();
    public UserEntity(String fullName, String email, String password,  String role,LocalDateTime createdAt) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }
}
