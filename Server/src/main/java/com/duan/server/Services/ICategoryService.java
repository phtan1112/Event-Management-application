package com.duan.server.Services;

import com.duan.server.DTO.CategoryDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICategoryService {
    CategoryDTO persist(MultipartFile image, String typeOfEvent);
    Boolean remove(String name);

    CategoryDTO findByType(String type);

    List<CategoryDTO> findAllCategory();
}
