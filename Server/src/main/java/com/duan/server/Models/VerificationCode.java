package com.duan.server.Models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "verification")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class VerificationCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String otp;
    private LocalTime createAt;
    private Boolean isExpired;

    public VerificationCode(String email, String otp, LocalTime creatAt, Boolean isExpired) {
        this.email = email;
        this.otp = otp;
        this.createAt = creatAt;
        this.isExpired = isExpired;
    }
}
