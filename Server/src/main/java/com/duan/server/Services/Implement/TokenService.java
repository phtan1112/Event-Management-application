package com.duan.server.Services.Implement;

import com.duan.server.Models.Token;
import com.duan.server.Models.UserEntity;
import com.duan.server.Repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    public void saveUserEntityIntoToken(UserEntity user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType("Bearer")
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
    public void revokeAndSetExpiredTokenOfUser(UserEntity user) {
        var validUserTokens = tokenRepository.findAllByUserAndExpiredAndRevoked(user,false,false);
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public int countAllTokenByUser(UserEntity user){
        return tokenRepository.countAllByUser(user);
    }

}
