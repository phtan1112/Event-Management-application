package com.duan.server.Configurations.Security;

import com.duan.server.Services.Implement.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfiguration {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(author -> author
                                //user
                                .requestMatchers(HttpMethod.GET, "/user/get-info").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/user/get-detail-by-admin/**").hasAuthority("ROLE_ADMIN")
                                .requestMatchers(HttpMethod.POST, "/user/register").permitAll()
                                .requestMatchers(HttpMethod.POST, "/user/login").permitAll()
                                .requestMatchers(HttpMethod.PATCH, "/user/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.PUT, "/user/change-password/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/user/upload").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.DELETE, "/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.POST, "/user/save-event/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/user/all-event-saved").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.POST, "/user/remove-event/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.PUT, "/user/restore-password").permitAll()

                                //category
                                .requestMatchers(HttpMethod.POST, "/api/v1/category/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/v1/category/**").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/v1/category/**").hasAuthority("ROLE_ADMIN")
                                //event
                                .requestMatchers(HttpMethod.POST, "/api/v1/event/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/all-event-user").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/detail/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/all-events").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/status/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/api/v1/event/cancel/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.PUT, "/api/v1/event/permit/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.PATCH, "/api/v1/event/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/filter/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/search/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.POST, "/api/v1/event/add-participator").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/view-event/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/v1/event/event-upcoming/**").hasAuthority("ROLE_USER")
                                //comment
                                .requestMatchers(HttpMethod.POST, "/api/v1/comment/**").hasAnyAuthority("ROLE_USER")
                                //disallow everything else
                                .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable)
                //below for JWT
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // [4 -> 31] -> big number-> robust and secure
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setMaxAge(3600L);
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
