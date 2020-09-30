package com.eareiza.springAngular.model.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.eareiza.springAngular.model.entity.Factura;

@Repository
public interface IFacturaRepository extends CrudRepository<Factura, Long> {

}
