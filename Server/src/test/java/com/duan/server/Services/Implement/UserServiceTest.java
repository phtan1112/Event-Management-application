package com.duan.server.Services.Implement;


import com.duan.server.Configurations.Security.CustomUserDetail;
import com.duan.server.Configurations.Security.JWTService;
import com.duan.server.Converter.UserConverter;
import com.duan.server.DTO.UserDTO;
import com.duan.server.Models.UserEntity;
import com.duan.server.Repository.UserRepository;
import com.duan.server.Validators.ValidateEmail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserConverter userConverter;



    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private MailService mailService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @Mock
    private TokenService tokenService;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);

    }
    @Test
     void testPersist() {
        // Given
        String userEmail = "test@gmail.com";
        String userPassword = "123456";

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(userEmail);
        userDTO.setPassword(userPassword);
        userDTO.setRole("ROLE_USER");

        // Mock behavior
        when(userRepository.findByEmail(userEmail)).thenReturn(null);

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(userEmail);
        when(userConverter.toEntity(any(UserDTO.class))).thenReturn(userEntity);

        when(passwordEncoder.encode(userPassword)).thenReturn("hashedPassword");


        // Mock behavior for userRepository.save
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);

        UserDTO savedUserDTO = new UserDTO(); // Mock saved UserDTO
        savedUserDTO.setEmail(userEmail);
        // Mock behavior for userConverter
        when(userConverter.toDto(userEntity)).thenReturn(savedUserDTO);

        // Mock behavior for mailService
        doNothing().when(mailService).sendAccountRegistered(anyString(), any(UserDTO.class));

        // When
        UserDTO result = userService.persist(userDTO);

        // Then
        assertNotNull(result);
        assertEquals(userEmail, result.getEmail());
        // Add more assertions as needed...
    }

    @Test
    void findUserByEmail() {
        // Given
        String userEmail = "test@gmail.com";

        // Mocking behavior
        UserEntity mockUserEntity = new UserEntity(); // Mocked UserEntity
        mockUserEntity.setEmail(userEmail);
        when(userRepository.findByEmail(anyString())).thenReturn(mockUserEntity);

        UserDTO mockUserDTO = new UserDTO(); // Mocked UserDTO
        mockUserDTO.setEmail(userEmail);
        when(userConverter.toDtoNotHidePassword(mockUserEntity)).thenReturn(mockUserDTO);

        // When
        UserDTO result = userService.findUserByEmail(userEmail);

        // Then
        assertNotNull(result);
        assertEquals(userEmail, result.getEmail());
        // Add more assertions as needed...
    }

    @Test
    void restorePassword() {
        // Given
        String userEmail = "test@example.com";
        String newPassword = "newPassword";

        // Mocking behavior
        UserEntity mockUserEntity = new UserEntity(); // Mocked UserEntity


        when(userRepository.findByEmail(userEmail)).thenReturn(mockUserEntity);
        when(passwordEncoder.encode(newPassword)).thenReturn("hashedPassword");

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(userEmail);
        when(userRepository.save(mockUserEntity)).thenReturn(userEntity);

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(userEmail);
        when(userConverter.toDto(any(UserEntity.class))).thenReturn(userDTO);



        // When
        UserDTO result = userService.restorePassword(userEmail, newPassword);

        // Then
        assertNotNull(result);
        assertEquals(userEmail, result.getEmail());
        // Add more assertions as needed...
    }

    @Test
    void findUserByEmailAndPassword() {
        // Given
        String userEmail = "test@gmail.com";
        String userPassword = "password";


        // Mocking behavior for authenticationManager.authenticate
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);

        UserEntity mockUserEntity = new UserEntity(); // Mocked UserEntity
        mockUserEntity.setEmail(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(mockUserEntity);

        String mockToken = "mockToken12345421";
        when(jwtService.generateToken(any(CustomUserDetail.class)))
                .thenReturn(mockToken);

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(userEmail);
        when(userConverter.toDto(any(UserEntity.class))).thenReturn(userDTO);

        when(tokenService.countAllTokenByUser(mockUserEntity)).thenReturn(2);



        // When
        UserDTO result = userService.findUserByEmailAndPassword(userEmail, userPassword);

        // Then
        assertNotNull(result);
        assertEquals(userEmail, result.getEmail());
        assertEquals(mockToken, result.getToken());
        // Add more assertions as needed...
    }

}