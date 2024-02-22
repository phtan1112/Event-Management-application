package com.duan.server.Repository;

import com.duan.server.Models.EventEntity;
import com.duan.server.Models.StatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusRepository extends JpaRepository<StatusEntity,Integer> {
    StatusEntity findByEvent(EventEntity eventEntity);


}
