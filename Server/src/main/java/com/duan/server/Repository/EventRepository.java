package com.duan.server.Repository;

import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer> {
    EventEntity findById(int id);
    List<EventEntity> findAllByUser(UserEntity userEntity);


    EventEntity findByIdAndUser(Integer id, UserEntity userEntity);

    @Query("SELECT e " +
            "from EventEntity as e" +
            " where e.category.typeOfEvent like ?1")
    List<EventEntity> findAllByCategoryEqual(String typeOfEvent);

    @Query("SELECT e " +
            "from EventEntity as e" +
            " where e.category.typeOfEvent like ?1 and e.title like %?2%")
    List<EventEntity> findAllByTitleAndCategoryEqual(String typeOfEvent,String title);

    List<EventEntity> findByTitleContaining(String title);

}
