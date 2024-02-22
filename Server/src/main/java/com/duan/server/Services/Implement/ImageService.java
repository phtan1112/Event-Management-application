package com.duan.server.Services.Implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Services.IImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ImageService implements IImageService {

    @Autowired
    private Cloudinary cloudinary;

    // accept list kind of images
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = List.of("jpg", "jpeg", "png");
    // id of default image user
    private static final String DEFAULT_IMAGE_USER = "sqytlfts5l2ymqkfhb56";


    @Override
    public String uploadImage(MultipartFile image) {
        try {
            //verify picture
            String originalFilename = image.getOriginalFilename();

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            if (!ALLOWED_IMAGE_EXTENSIONS.contains(fileExtension)) {
                return null;
            }
            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinary
                    .uploader()
                    .upload(image.getBytes(),
                            ObjectUtils.emptyMap());
            // get url when upload successful
            String imageUrl = (String) uploadResult.get("secure_url");

            return imageUrl;

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }



    @Override
    public void removeImageExist(String urlImage) {
        try {
            // get id of image that want to delete
            String id_image_delete = extractUrlToGetIdOfImage(urlImage);
            // cannot delete default user
            if (!id_image_delete.equalsIgnoreCase(DEFAULT_IMAGE_USER)) {
                // handle delete
                cloudinary.uploader().destroy(id_image_delete, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String extractUrlToGetIdOfImage(String urlImage) {

        String[] parts = urlImage.split("/");
        String fileName = parts[parts.length - 1];
        return fileName.substring(0, fileName.lastIndexOf("."));
    }


}
