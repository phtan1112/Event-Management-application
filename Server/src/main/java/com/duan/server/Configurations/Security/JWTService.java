package com.duan.server.Configurations.Security;

import com.duan.server.Models.Token;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTService {


    private static final String SECRET_KEY = "VGhpcyBpcyBhIGtleSBpbiBCYXNl384240124NjQgdGV4dC4=";

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder().setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 7L * 24L * 60L * 60L * 1000L)) // 7 days
                .signWith(getSigninKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSigninKey() {
        byte[] key = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(key);

    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claims != null ? claimsResolvers.apply(claims) : null;
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }

    public String extractUsername(String token) { // return the email of user
        return extractClaim(token, Claims::getSubject);

    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        Date tokenClaim = extractClaim(token, Claims::getExpiration);
        return tokenClaim == null || tokenClaim.before(new Date());
    }

}
