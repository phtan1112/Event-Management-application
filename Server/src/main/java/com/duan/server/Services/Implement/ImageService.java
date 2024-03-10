package com.duan.server.Services.Implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.duan.server.Services.IImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Future;

@Service
@Transactional
@EnableAsync
public class ImageService implements IImageService {

    @Autowired
    private Cloudinary cloudinary;


    // accept list kind of images
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = List.of("jpg", "jpeg", "png","HEIC");
    // id of default image user
    private static final String DEFAULT_IMAGE_USER = "defaultAvtUser_csavc3";

    @Autowired
    private Executor asyncExecutor;


    @Async("asyncExecutor")
    @Override
    public Future<String> uploadImage(MultipartFile image) {
        try {
            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
            // get url when upload successful
            String imageUrl = (String) uploadResult.get("secure_url");
            return CompletableFuture.completedFuture(imageUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    @Async("asyncExecutor")
    @Override
    public Future<Boolean> checkImageIsValid(MultipartFile image) {
        String originalFilename = image.getOriginalFilename();

        if(originalFilename != null){
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            if (!ALLOWED_IMAGE_EXTENSIONS.contains(fileExtension)) {
                return CompletableFuture.completedFuture(false);
            }
            return CompletableFuture.completedFuture(true);
        }
        return CompletableFuture.completedFuture(false);
    }

    @Async("asyncExecutor")
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
