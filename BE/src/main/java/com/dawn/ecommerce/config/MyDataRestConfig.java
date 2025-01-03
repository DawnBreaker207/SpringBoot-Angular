package com.dawn.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.dawn.ecommerce.entity.Product;
import com.dawn.ecommerce.entity.ProductCategory;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

	HttpMethod[] theUnSupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE };

	// Disable HTTP methods for Product: PUT, POST and DELETE
	config.getExposureConfiguration().forDomainType(Product.class)
		.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
		.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));

	// Disable HTTP methods for ProductCategory: PUT, POST and DELETE
	config.getExposureConfiguration().forDomainType(ProductCategory.class)
		.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
		.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));
    }
}
