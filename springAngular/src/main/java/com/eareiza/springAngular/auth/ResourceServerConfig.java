package com.eareiza.springAngular.auth;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
//permite que nuestra aplicación se comporte como un  servidor de recursos 
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter{

	@Override
	public void configure(HttpSecurity http) throws Exception {
		//Se permite a todos el accesso por el metodo get a "/api/clientes"
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/clientes", "/api/clientes/page/**", "/api/uploads/img/**").permitAll()
		.antMatchers(HttpMethod.GET, "/api/clientes/{id}").hasAnyRole("USER","ADMIN")
		.antMatchers(HttpMethod.POST, "/api/clientes").hasRole("ADMIN")
		.antMatchers(HttpMethod.POST, "/api/clientes/upload").hasAnyRole("USER","ADMIN")
		.antMatchers("/api/clientes/**").hasRole("ADMIN")		
		//Se valida que el cliente este autenticado
		.anyRequest().authenticated();
	}
	
}
