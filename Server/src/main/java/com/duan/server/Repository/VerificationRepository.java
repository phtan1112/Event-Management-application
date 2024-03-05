package com.duan.server.Repository;

import com.duan.server.Models.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRepository extends JpaRepository<VerificationCode,Integer> {


    VerificationCode findByEmailAndOtp(String email, String otp);
    List<VerificationCode> findAllByIsExpired(Boolean isExpired);
}
