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
    private Integer birthYear;
    private String role;

    @JsonFormat(pattern = "yy-MM-dd HH-mm")
    private LocalDate createdAt;
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

    public void addEventToSaveList(EventEntity e){
        if(list_events_saved == null){
            this.list_events_saved = new HashSet<>();
        }
        this.list_events_saved.add(e);
    }

    public void removeEventToSaveList(EventEntity e){
        if(list_events_saved == null){
            this.list_events_saved = new HashSet<>();
        }
        list_events_saved.removeIf(s -> Objects.equals(s.getId(), e.getId()));
//        this.list_events_saved.remove(e);
    }

    public void addEvent(EventEntity e){
        if(events_participate == null){
            this.events_participate = new ArrayList<>();
        }
        this.events_participate.add(e);
    }

    public UserEntity(String fullName, String email, String password, Integer birthYear, String role,LocalDate createdAt) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.birthYear = birthYear;
        this.role = role;
        this.createdAt = createdAt;
    }
}
