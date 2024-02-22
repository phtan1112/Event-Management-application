package com.duan.server.Repository;

import com.duan.server.Models.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Integer> {
    CategoryEntity findCategoryEntityByTypeOfEventIgnoreCase(String type);

}
