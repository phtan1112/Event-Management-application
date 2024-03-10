package com.duan.server.Services.Implement;

import com.duan.server.Configurations.Security.CustomUserDetail;
import com.duan.server.Configurations.Security.JWTService;
import com.duan.server.Converter.EventConverter;
import com.duan.server.Converter.UserConverter;
import com.duan.server.DTO.EventDTO;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.EventEntity;
import com.duan.server.Models.UserEntity;
import com.duan.server.Repository.UserRepository;
import com.duan.server.Response.ResponseEvent;
import com.duan.server.Services.IUserService;
import com.duan.server.Validators.ValidateEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Transactional
public class UserService implements IUserService, UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserConverter userConverter;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ImageService imageService;

    @Autowired
    private EventService eventService;
    @Autowired
    private EventConverter eventConverter;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MailService mailService;


    @Override
    public String getUserEmailByAuthorization() {
        //find email user through Authorization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // because I use the email not using username
    }

    @Override
    public String getRoleUser() {
        String author = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        //[ROLE_USER]
        return author.substring(1, author.length() - 1);
    }

    @Override
    public UserDTO persist(UserDTO userDTO) {
        if (findUserByEmail(userDTO.getEmail()) != null) { // has user with email exist
            return null;
        } else {
            if (!ValidateEmail.validateEmail(userDTO.getEmail())) {
                return null;
            } else if (userDTO.getPassword().length() < 6) {
                return null;
            }
            UserEntity userEntity = userConverter.toEntity(userDTO);
            userEntity.setLogin_times(1);
            userEntity.setRole("ROLE_USER");
            if (userEntity.getAvatar() == null) {
                userEntity.setAvatar("https://res.cloudinary.com/dt7a2rxcl/image/upload/v1709819363/defaultAvtUser_csavc3.jpg");
            }
            userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
            userEntity.setCreatedAt(LocalDateTime.now());

            userEntity = userRepository.save(userEntity);

            UserDTO userDTO1 = userConverter.toDto(userEntity);
            userDTO1.setToken(null);

            mailService.sendAccountRegistered(userDTO1.getEmail(), userDTO1);
            return userDTO1;
        }
    }


    @Override
    public UserDTO findUserByEmail() {
        String email = getUserEmailByAuthorization();
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity != null) {
            UserDTO userDTO = userConverter.toDto(userEntity);
            userDTO.setList_events_saved(
                    userConverter.convertEventSavedListToDTO(userEntity.getList_events_saved()));
            return userDTO;
        }
        return null;

    }

    @Override
    public UserDTO findUserByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity != null) {
            UserDTO userDTO = userConverter.toDto(userEntity);
            userDTO.setList_events_saved(
                    userConverter.convertEventSavedListToDTO(userEntity.getList_events_saved()));
            return userDTO;
        }
        return null;
    }

    @Override
    public UserDTO restorePassword(String email, String password) {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity.getId() != null && password.length() >= 6) {
            userEntity.setPassword(passwordEncoder.encode(password));

            String token = jwtService.generateToken(new CustomUserDetail(userEntity));

            userEntity = userRepository.save(userEntity);

            tokenService.revokeAndSetExpiredTokenOfUser(userEntity);
            tokenService.saveUserEntityIntoToken(userEntity, token);

            UserDTO userDTO = userConverter.toDto(userEntity);
            userDTO.setToken(token);
            return userDTO;
        }
        return null;
    }

    @Override
    public UserDTO getDetailUserByAdmin(String email) {
        if (getRoleUser().equals("ROLE_ADMIN")) {
            return findUserByEmail(email);
        }
        return null;
    }

    @Override
    public UserDTO findUserByEmailAndPassword(String email, String password) { //login
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                email, password
        ));
        UserEntity userEntity = userRepository.findByEmail(email);
        userEntity.setLogin_times(userEntity.getLogin_times() + 1);

        String token = jwtService.generateToken(new CustomUserDetail(userEntity));
        UserDTO userDTO = userConverter.toDto(userEntity);

        int numberToken = tokenService.countAllTokenByUser(userEntity);
        if (numberToken > 2) {
            tokenService.revokeAndSetExpiredTokenOfUser(userEntity);
        }
        tokenService.saveUserEntityIntoToken(userEntity, token);


        userDTO.setList_events_saved(
                userConverter.convertEventSavedListToDTO(userEntity.getList_events_saved()));
        userDTO.setToken(token);

        return userDTO;
    }

    @Transactional
    @Override
    public Boolean updatePassword(String email, String oldPassword, String newPassword) {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity != null) {
            String roleAuth = getRoleUser();
            if (roleAuth.equals("ROLE_USER")) {
                if (getUserEmailByAuthorization().equals(email)) {
                    if (passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
                        userEntity.setPassword(passwordEncoder.encode(newPassword));
                        try {
                            userRepository.save(userEntity);
                            return true;
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    } else return false;

                } else return false;
            } else if (roleAuth.equals("ROLE_ADMIN")) {
                if (passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
                    userEntity.setPassword(passwordEncoder.encode(newPassword));
                    try {
                        userRepository.save(userEntity);
                        return true;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                } else return false;
            }
        }
        return false;
    }

    @Override
    public Boolean updateSomeData(String email, Map<Object, Object> fields) {
        UserEntity userEntity = userRepository.findByEmail(email);
        AtomicBoolean check = new AtomicBoolean(false);
        if (userEntity != null) {
            String roleAuth = getRoleUser();
            if (roleAuth.equals("ROLE_USER")) {
                if (getUserEmailByAuthorization().equals(email)) {
                    fields.forEach((key, value) -> {
                        String parseKey = (String) key;
                        if (parseKey.equalsIgnoreCase("fullName")) {
                            Field field = ReflectionUtils.findField(UserEntity.class, parseKey);
                            field.setAccessible(true);
                            ReflectionUtils.setField(field, userEntity, value);
                            userRepository.save(userEntity);
                            check.set(true);
                        }
                    });
                } else return false;
            }
        }


        return check.get();
    }

    @Override
    public Boolean deleteAccount(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity != null) {
            String roleAuth = getRoleUser();
            if (roleAuth.equals("ROLE_USER")) {
                if (getUserEmailByAuthorization().equals(email)) {
                    userRepository.delete(userEntity);
                    return true;
                } else return false;
            } else if (roleAuth.equals("ROLE_ADMIN")) {
                userRepository.delete(userEntity);
                return true;
            }
        }
        return false;
    }

    @Override
    public UserDTO uploadAvatarUserByEmail(String email, MultipartFile image) {
        UserDTO userDTO = findUserByEmail(email);
        String emailFromAuthorization = getUserEmailByAuthorization();
        if (userDTO.getId() != null) {
            String roleAuth = getRoleUser();
            if (roleAuth.equals("ROLE_USER")) {
                if (emailFromAuthorization.equals(email)) {
                    try {
                        if (imageService.checkImageIsValid(image).get()) {
                            Future<String> urlImageUploaded = imageService.uploadImage(image);
                            if (urlImageUploaded != null) {
                                imageService.removeImageExist(userDTO.getAvatar());

                                userDTO.setAvatar(urlImageUploaded.get());

                                UserEntity userEntity = userRepository.save(userConverter.toEntity(userDTO));
                                return userConverter.toDto(userEntity);
                            }
                        }
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    } catch (ExecutionException e) {
                        throw new RuntimeException(e);
                    }


                }
            }
        }
        return null;
    }

    @Override
    public Set<EventDTO> seeAllEventsSavedOfUser() {
        UserEntity userEntity = userRepository.findByEmail(getUserEmailByAuthorization());
        Set<EventDTO> list_saved = userConverter.convertEventSavedListToDTO(userEntity.getList_events_saved());
        return list_saved;
    }

    @Override
    public UserDTO saveEventIntoEventSaveListByUser(int idEvent) {
        UserDTO userDTO = findUserByEmail();
        EventDTO eventDTO = eventService.findById(idEvent);
        if (userDTO != null && eventDTO != null) {
            if (!checkEventIsInEventSavedListOrNot(
                    userDTO.getList_events_saved(),
                    eventDTO)) {
                userDTO.addEventToSaveList(eventDTO);
                UserEntity userEntity = userConverter.toEntity(userDTO);
                userEntity.setList_events_saved(
                        userConverter.convertEventSavedListToEntity(userDTO.getList_events_saved()));
                userEntity = userRepository.save(userEntity);
                userDTO = userConverter.toDto(userEntity);
                userDTO.setList_events_saved(
                        userConverter.convertEventSavedListToDTO(userEntity.getList_events_saved()));
                return userDTO;
            } else {
                return null;
            }

        }
        return null;
    }

    private Boolean checkEventIsInEventSavedListOrNot(Set<EventDTO> eventSavedList, EventDTO eventDTO) {
        for (EventDTO eventDTO1 : eventSavedList) {
            if (eventDTO1.getId() == eventDTO.getId()) {
                return true;
            }
        }
        return false;
    }

    @Override
    public UserDTO removeEventFromEventSavedList(int idEvent) {
        UserDTO userDTO = findUserByEmail();
        EventDTO eventDTO = eventService.findById(idEvent);
        if (userDTO != null && eventDTO != null) {
            if (checkEventIsInEventSavedListOrNot(
                    userDTO.getList_events_saved()
                    , eventDTO)) {
                userDTO.removeEventToSaveList(eventDTO);
                UserEntity userEntity = userConverter.toEntity(userDTO);
                userEntity.setList_events_saved(
                        userConverter.convertEventSavedListToEntity(userDTO.getList_events_saved()));
                userEntity = userRepository.save(userEntity);
                userDTO = userConverter.toDto(userEntity);
                userDTO.setList_events_saved(
                        userConverter.convertEventSavedListToDTO(userEntity.getList_events_saved()));
                return userDTO;
            } else {
                return null;
            }

        }
        return null;
    }

    @Override
    public Boolean removeAllEventOfSavedListEvent(int idEvent) {
        List<UserEntity> userSaveEventList = userRepository.findAllByList_events_savedId(idEvent);

        if (!userSaveEventList.isEmpty()) {
            for (UserEntity user : userSaveEventList) {
                Set<EventEntity> savedEventsList = user.getList_events_saved();
                savedEventsList.removeIf(event -> event.getId().equals(idEvent));
            }
            userRepository.saveAll(userSaveEventList);
            return true;
        }

        return false;
    }

    @Override
    public List<ResponseEvent> getAllEventsParticipated() {
        List<ResponseEvent> listEventParticipated = eventService.getAllEventsByUserParticipated(findUserByEmail().getId());
        return listEventParticipated.isEmpty() ? new ArrayList<>() : listEventParticipated;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity u = userRepository.findByEmail(email);
        if (u != null) {
            return new CustomUserDetail(u);
        }
        throw new UsernameNotFoundException("User not found");
    }
}
