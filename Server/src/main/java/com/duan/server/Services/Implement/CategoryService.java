package com.duan.server.Services.Implement;

import com.duan.server.Converter.CategoryConverter;
import com.duan.server.DTO.CategoryDTO;
import com.duan.server.Models.CategoryEntity;
import com.duan.server.Repository.CategoryRepository;
import com.duan.server.Services.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    @Autowired
    private CategoryConverter categoryConverter;
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ImageService imageService;



    @Override
    public CategoryDTO persist(MultipartFile image, String typeOfEvent) {
        String urlImage = imageService.uploadImage(image);
        if(urlImage!=null){
            CategoryDTO categoryDTO = new CategoryDTO(urlImage,typeOfEvent);
            CategoryEntity categoryEntity = categoryRepository.save(categoryConverter.toEntity(categoryDTO));
            return categoryConverter.toDTO(categoryEntity);
        }
        return null;
    }

    @Override
    public Boolean remove(String type) {
        CategoryEntity categoryEntity = categoryRepository.findCategoryEntityByTypeOfEventIgnoreCase(type);
        if(categoryEntity!= null){
            categoryRepository.delete(categoryEntity);
            return true;
        }
        return false;
    }

    @Override
    public CategoryDTO findByType(String type) {
        CategoryEntity categoryEntity = categoryRepository.findCategoryEntityByTypeOfEventIgnoreCase(type);

        return categoryEntity != null ? categoryConverter.toDTO(categoryEntity) : null;
    }

    @Override
    public List<CategoryDTO> findAllCategory() {
        List<CategoryDTO> lstDto = new ArrayList<>();
        categoryRepository.findAll().forEach(cEntity -> lstDto.add(categoryConverter.toDTO(cEntity)));
        return lstDto;
    }

}
