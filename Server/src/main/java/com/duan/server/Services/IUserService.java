package com.duan.server.Services;

import com.duan.server.DTO.UserDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface IUserService {
    String getUserEmailByAuthorization();
    String getRoleUser();
    UserDTO persist(UserDTO userDTO);
    UserDTO findUserByEmail();
    UserDTO findUserByEmail(String email);
    UserDTO getDetailUserByAdmin(String email);
    UserDTO findUserByEmailAndPassword(String email,String password);

    Boolean updatePassword(String email, String oldPassword, String newPassword);

    Boolean updateSomeData(String email, Map<Object, Object> fields);

    Boolean deleteAccount(String email);

    UserDTO uploadAvatarUserByEmail(String email, MultipartFile image);

    UserDTO saveEventIntoEventSaveListByUser(int idEvent);
    UserDTO removeEventFromEventSavedList(int idEvent);
}
