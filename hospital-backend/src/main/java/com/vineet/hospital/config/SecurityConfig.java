package com.vineet.hospital.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity 
public class SecurityConfig {
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider=new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	
	    http
	        .cors(Customizer.withDefaults())
	        .csrf(csrf -> csrf.disable())
	
	        .authorizeHttpRequests(auth -> auth
	
	            // Public endpoints
	            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	            .requestMatchers(
	                "/api/auth/**",
	                "/v3/api-docs/**",
	                "/swagger-ui/**",
	                "/swagger-ui.html",
	                "/actuator/health/",
	                "/actuator/health/**"
	            ).permitAll()
	            
	            .requestMatchers("/actuator/**").denyAll()
	
	            // Doctor endpoints
	            .requestMatchers(
	                HttpMethod.GET,
	                "/api/doctors/myProfile",
	                "/api/doctors/slots"
	            ).hasRole("DOCTOR")
	
	            .requestMatchers(
	                "/api/doctors/slots/**",
	                "/api/doctors/appointments/**",
	                "/api/doctors/consultation/**"
	            ).hasRole("DOCTOR")
	
	            .requestMatchers(HttpMethod.PUT, "/api/doctors")
	                .hasRole("DOCTOR")
	
	            .requestMatchers(HttpMethod.DELETE, "/api/doctors/*")
	                .hasRole("ADMIN")
	
	            // Public doctor discovery
	            .requestMatchers(
	                HttpMethod.GET,
	                "/api/doctors",
	                "/api/doctors/*",
	                "/api/doctors/*/slots"
	            ).permitAll()
	
	            // Patient endpoints
	            .requestMatchers(HttpMethod.POST, "/api/appointments")
	                .hasRole("PATIENT")
	
	            .requestMatchers(HttpMethod.GET, "/api/appointments")
	                .hasRole("PATIENT")
	
	            .requestMatchers(
	                HttpMethod.PUT,
	                "/api/appointments/*/reschedule"
	            ).hasRole("PATIENT")
	
	            .requestMatchers(HttpMethod.DELETE, "/api/appointments/*")
	                .hasRole("PATIENT")
	
	            .requestMatchers(
	                HttpMethod.GET,
	                "/api/appointments/*/consultation"
	            ).hasRole("PATIENT")
	
	            // Doctor appointment access
	            .requestMatchers(HttpMethod.GET, "/api/appointments/doctor")
	                .hasRole("DOCTOR")
	
	            // Appointment details
	            .requestMatchers(HttpMethod.GET, "/api/appointments/*")
	                .hasAnyRole("PATIENT", "DOCTOR", "ADMIN")
	
	            // Patient profile
	            .requestMatchers("/api/patients/**")
	                .hasRole("PATIENT")
	
	            // Everything else
	            .anyRequest().authenticated()
	        )
	
	        .httpBasic(basic -> basic.disable())
	        .formLogin(form -> form.disable())
	
	        .sessionManagement(session -> session
	            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	        )
	
	        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	
	    return http.build();
	}

    @Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		
		return config.getAuthenticationManager(); 
	}
	
	@Bean
    public MethodSecurityExpressionHandler expressionHandler(PermissionEvaluator evaluator) {
        DefaultMethodSecurityExpressionHandler handler = new DefaultMethodSecurityExpressionHandler();
        handler.setPermissionEvaluator(evaluator);
        return handler;
    }
	
	
}
