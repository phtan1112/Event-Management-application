package com.duan.server.Models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name ="tblComment")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String content;
    private int star;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id",nullable = false)
    @JsonManagedReference
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id",nullable = false)
    @JsonManagedReference
    private EventEntity event;

    public CommentEntity(String content, int star, LocalDateTime createdAt, UserEntity user, EventEntity event) {
        this.content = content;
        this.star = star;
        this.createdAt = createdAt;
        this.user = user;
        this.event = event;
    }
}
