package com.duan.server.Services;

import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Response.ResponseEvent;
import org.apache.catalina.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IUserService {
    String getUserEmailByAuthorization();
    String getRoleUser();
    UserDTO persist(UserDTO userDTO);
    UserDTO findUserByEmail();
    UserDTO findUserByEmail(String email);
    UserDTO restorePassword(String email,String password);
    UserDTO getDetailUserByAdmin(String email);
    UserDTO findUserByEmailAndPassword(String email,String password);

    Boolean updatePassword(String email, String oldPassword, String newPassword);

    Boolean updateSomeData(String email, Map<Object, Object> fields);

    Boolean deleteAccount(String email);

    UserDTO uploadAvatarUserByEmail(String email, MultipartFile image);
    Set<EventDTO> seeAllEventsSavedOfUser();
    UserDTO saveEventIntoEventSaveListByUser(int idEvent);
    UserDTO removeEventFromEventSavedList(int idEvent);

    Boolean removeAllEventOfSavedListEvent(int idEvent);

    List<ResponseEvent> getAllEventsParticipated();
}
