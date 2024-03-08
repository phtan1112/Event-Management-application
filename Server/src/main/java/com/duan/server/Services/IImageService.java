package com.duan.server.Services;

import com.duan.server.DTO.CategoryDTO;
import com.duan.server.DTO.UserDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.concurrent.Future;

public interface IImageService {
    Future<String> uploadImage(MultipartFile image);
    Future<Boolean> checkImageIsValid(MultipartFile image);
    void removeImageExist(String urlImage);
}
