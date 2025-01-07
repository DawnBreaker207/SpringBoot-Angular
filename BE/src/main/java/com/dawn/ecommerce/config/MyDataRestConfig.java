package com.dawn.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.util.pattern.PathPattern;

import com.dawn.ecommerce.entity.Country;
import com.dawn.ecommerce.entity.Order;
import com.dawn.ecommerce.entity.Product;
import com.dawn.ecommerce.entity.ProductCategory;
import com.dawn.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Value("${allowed.origins}")
    private String[] allowedOrigins;
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
	entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

	HttpMethod[] theUnSupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH };

	// Disable HTTP methods for Product: PUT, POST and DELETE
	disableHttpMethods(Product.class, config, theUnSupportedActions);
	// Disable HTTP methods for ProductCategory: PUT, POST and DELETE
	disableHttpMethods(ProductCategory.class, config, theUnSupportedActions);
	disableHttpMethods(Country.class, config, theUnSupportedActions);
	disableHttpMethods(State.class, config, theUnSupportedActions);
	disableHttpMethods(Order.class, config, theUnSupportedActions);
	
	// Call an internal helper method
	exposeIds(config);

	// Configure CORS mapping
	cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
	    HttpMethod[] theUnSupportedActions) {
	config.getExposureConfiguration().forDomainType(theClass)
		.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
		.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
	// Expose entity ids

	// Get a list of all entity classes from the entity manager
	Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

	// Create an array of the entity types
	List<Class> entityClasses = new ArrayList<>();

	for (EntityType tempEntityType : entities) {
	    entityClasses.add(tempEntityType.getJavaType());
	}
	// Expose the entity ids for the array
	Class[] domainTypes = entityClasses.toArray(new Class[0]);
	config.exposeIdsFor(domainTypes);
    }
}
