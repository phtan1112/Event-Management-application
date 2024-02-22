package com.duan.server.Repository;

import com.duan.server.Models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer> {
    @Query("SELECT u FROM UserEntity u WHERE u.email = :email")
    UserEntity findByEmail(@Param("email") String email);
    @Query("SELECT u FROM UserEntity u WHERE u.email = :email and u.password = :password")
    UserEntity findByEmailAndPassword(@Param("email") String email, @Param("password")String password);
}
