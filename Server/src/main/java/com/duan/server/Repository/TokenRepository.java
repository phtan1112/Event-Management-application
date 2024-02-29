package com.duan.server.Repository;

import com.duan.server.Models.Token;
import com.duan.server.Models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token,Integer> {
    List<Token> findAllByUserAndExpiredAndRevoked(UserEntity user, boolean expired, boolean revoked);

    Optional<Token> findByToken(String token);

//    int countAllByUserAnd(UserEntity user);


}
