package com.duan.server.Configurations.Security;


import com.duan.server.Models.Token;
import com.duan.server.Services.Implement.TokenService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;


@Service
public class LogoutService implements LogoutHandler {

    @Autowired
    private TokenService tokenService;

    @Override
    public void logout(HttpServletRequest request,
                       HttpServletResponse response,
                       Authentication authentication) {

        final String authHeader = request.getHeader("Authorization");

        if (StringUtils.isEmpty(authHeader)
                || !org.apache.commons.lang3.StringUtils.startsWith(authHeader, "Bearer ")) {
            return;
        }
        final String jwt = authHeader.substring(7);
        Token tokenUser = tokenService.findByTokenUser(jwt);
        if (tokenUser != null) {
            if( tokenUser.isExpired() && tokenUser.isRevoked()){
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            }
            else{
                tokenUser.setExpired(true);
                tokenUser.setRevoked(true);
                tokenService.saveToken(tokenUser);
                SecurityContextHolder.clearContext();
            }
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
