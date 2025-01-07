package com.dawn.ecommerce.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

import com.okta.spring.boot.oauth.Okta;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

	// Protect endpoint /api/orders
	http.authorizeHttpRequests(configurer -> configurer.requestMatchers("/api/orders/**").authenticated())
		.oauth2ResourceServer(oAuth -> oAuth.jwt(Customizer.withDefaults()));
	// Add CORS filters
	http.cors(Customizer.withDefaults());

	// Add content negotiation strategy
	http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

	// Force a non-empty response body for 401 to make the response more friendly
	Okta.configureResourceServer401ResponseBody(http);

	// Disable CSRF since we are not using Cookies for session tracking
	http.csrf(csrf -> csrf.disable());
	return http.build();
    }
}
