package com.duan.server.Repository;

import com.duan.server.Models.CommentEntity;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity,Integer> {
    Optional<CommentEntity> findByIdAndUser(Integer id, UserEntity userEntity);

    List<CommentEntity> findAllByEvent(EventEntity eventEntity);
}
