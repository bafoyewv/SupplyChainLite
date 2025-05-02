package com.company.config;

import com.company.users.Role;
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
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                // User endpoints
                .requestMatchers("/api/v1/user/profile").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                .requestMatchers("/api/v1/user/update").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                
                // Admin endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                
                // Store endpoints
                .requestMatchers("/api/v1/store/create").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/store/update/**").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/store/delete/**").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/store/my-stores").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/store/**").hasAnyRole("STORE_OWNER", "ADMIN")
                
                // Staff endpoints
                .requestMatchers("/api/v1/staff/create").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/staff/update/**").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/staff/delete/**").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/staff/my-staff").hasRole("STORE_OWNER")
                .requestMatchers("/api/v1/staff/**").hasAnyRole("STAFF", "ADMIN")
                
                // Supplier endpoints
                .requestMatchers("/api/v1/supplier/create").hasRole("ADMIN")
                .requestMatchers("/api/v1/supplier/update/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/supplier/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/supplier/**").hasAnyRole("SUPPLIER", "ADMIN")
                
                // Product endpoints
                .requestMatchers("/api/v1/product/create").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/update/**").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/delete/**").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/my-products").hasAnyRole("STORE_OWNER", "ADMIN")
                .requestMatchers("/api/v1/product/**").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                
                // Order endpoints
                .requestMatchers("/api/v1/order/create").hasAnyRole("USER", "STAFF")
                .requestMatchers("/api/v1/order/update/**").hasAnyRole("USER", "STAFF", "ADMIN")
                .requestMatchers("/api/v1/order/delete/**").hasAnyRole("USER", "STAFF", "ADMIN")
                .requestMatchers("/api/v1/order/my-orders").hasAnyRole("USER", "STAFF")
                .requestMatchers("/api/v1/order/**").hasAnyRole("USER", "ADMIN", "STORE_OWNER", "STAFF", "SUPPLIER")
                
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
} 