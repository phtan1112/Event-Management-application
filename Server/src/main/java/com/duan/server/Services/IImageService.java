package com.duan.server.Services;

import com.duan.server.DTO.CategoryDTO;
import com.duan.server.DTO.UserDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface IImageService {
    String uploadImage(MultipartFile image);

    void removeImageExist(String urlImage);
}
