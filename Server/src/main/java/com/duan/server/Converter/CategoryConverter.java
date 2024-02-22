package com.duan.server.Converter;

import com.duan.server.DTO.CategoryDTO;
import com.duan.server.Models.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryConverter {


    public CategoryEntity toEntity(CategoryDTO categoryDTO) {
        CategoryEntity categoryEntity = new CategoryEntity();
        if (categoryDTO.getId() != null) {
            categoryEntity.setId(categoryDTO.getId());
        }
        categoryEntity.setThumbnail(categoryDTO.getThumbnail());
        categoryEntity.setTypeOfEvent(categoryDTO.getTypeOfEvent());
        return categoryEntity;
    }


    public CategoryDTO toDTO(CategoryEntity categoryEntity) {
        CategoryDTO categoryDTO = new CategoryDTO();
        if (categoryEntity.getId() != null) {
            categoryDTO.setId(categoryEntity.getId());
        }
        categoryDTO.setThumbnail(categoryEntity.getThumbnail());
        categoryDTO.setTypeOfEvent(categoryEntity.getTypeOfEvent());
        return categoryDTO;
    }
}
