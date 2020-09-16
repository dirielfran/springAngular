package com.eareiza.springAngular.model.service;

import com.eareiza.springAngular.model.entity.Usuario;

public interface IUsuariosService {
	public Usuario findByUsername(String username);
}
