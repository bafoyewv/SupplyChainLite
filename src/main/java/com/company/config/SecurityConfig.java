package com.company.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // User endpoints
                .requestMatchers("/api/v1/user/profile").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                .requestMatchers("/api/v1/user/update").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                .requestMatchers("/api/v1/user/**").hasRole("ADMIN")
                
                // Product endpoints
                .requestMatchers("/api/v1/product/create").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/update/**").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/delete/**").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/**").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                
                // Inventory endpoints
                .requestMatchers("/api/v1/inventory/create").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/inventory/update/**").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/inventory/delete/**").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/inventory/**").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                
                // Order endpoints
                .requestMatchers("/api/v1/order/create").hasAnyRole("USER", "STAFF")
                .requestMatchers("/api/v1/order/update/**").hasAnyRole("USER", "STAFF", "ADMIN")
                .requestMatchers("/api/v1/order/delete/**").hasAnyRole("USER", "STAFF", "ADMIN")
                .requestMatchers("/api/v1/order/**").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                
                // Supplier endpoints
                .requestMatchers("/api/v1/supplier/create").hasRole("ADMIN")
                .requestMatchers("/api/v1/supplier/update/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/supplier/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/supplier/**").hasAnyRole("SUPPLIER", "ADMIN")
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 