package com.eareiza.springAngular.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eareiza.springAngular.model.entity.Usuario;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {

	public Usuario findByUsername(String username);
	
	@Query("SELECT u FROM Usuario u WHERE u.username = ?1")
	public Usuario findByUsername2(String username);
}
