package com.eareiza.springAngular.model.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class UploadFileServiceImpl implements IUploadFileService{

	private final Logger log = LoggerFactory.getLogger(UploadFileServiceImpl.class);
	
	private final static String DIRECTORIO_UPLOAD = "uploads";
	
	@Override
	public Resource cargar(String nombreFoto) throws MalformedURLException {
		Path ruta = getPath(nombreFoto);
		log.info(ruta.toString());
		Resource recurso = new UrlResource(ruta.toUri());
		
		//Se valida si existe y si se puede leer el recurso
		if(recurso.exists() && !recurso.isReadable()) {
			ruta = Paths.get("src/main/resources/static/images").
					resolve("noUser.png").toAbsolutePath();
			recurso = new UrlResource(ruta.toUri());

			log.error("No se pudo cargar la imagen: "+nombreFoto);
		}
		return recurso;
	}

	@Override
	public String copiar(MultipartFile archivo) throws IOException {
		//Se recupera el nombre del archivo
		String nombreArchivo = UUID.randomUUID().toString() + "_" +archivo.getOriginalFilename().replace(" ", " ");
		//Se recupera ruta completa 
		Path rutaArchivo = getPath(nombreArchivo);
		log.info(rutaArchivo.toString());
		//Se copia el archivo en la ruta		
		Files.copy(archivo.getInputStream(), rutaArchivo);
		
		return nombreArchivo;
	}

	@Override
	public boolean eliminar(String nombreFoto) {
		if(nombreFoto != null && nombreFoto.length() > 0) {
			Path rutaAnterior = Paths.get("uploads").resolve(nombreFoto).toAbsolutePath();
			File archivoAnterior = rutaAnterior.toFile();
			if(archivoAnterior.exists() && archivoAnterior.canRead()) {
				archivoAnterior.delete();
				return true;
			}
		}
		return false;
	}

	@Override
	public Path getPath(String nombreFoto) {
		// TODO Auto-generated method stub
		return Paths.get(DIRECTORIO_UPLOAD).resolve(nombreFoto).toAbsolutePath();
	}

}
