package com.openclassrooms.mddapi.services;

import java.security.SignatureException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

@Service
public class JWTService 
{
    @Autowired
    private JwtEncoder encoder;

    @Autowired
    private JwtDecoder decoder;

    public String generateToken(Authentication authentication)
    {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(now.plus(1, ChronoUnit.HOURS))
            .subject(authentication.getName())
            .build();
        JwtEncoderParameters parameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims);
        return this.encoder.encode(parameters).getTokenValue();
    }

    public String getUserNameFromJwtToken(String token) {
        return this.decoder.decode(token).getSubject();
      }

    public boolean validateJwtToken(String token) 
    {
        try {
            this.decoder.decode(token);
            return true;
        } catch (JwtException e) {
            System.err.println(String.format("Invalid JWT token: {1}", e.getMessage()));
        } catch (IllegalArgumentException e) {
            System.err.println(String.format("JWT claims string is empty: {1}", e.getMessage()));
        }

        return false;
    }
}
