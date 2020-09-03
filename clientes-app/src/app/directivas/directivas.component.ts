import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directivas',
  templateUrl: './directivas.component.html',
  styleUrls: ['./directivas.component.css']
})
export class DirectivasComponent implements OnInit {
  //Se añade lista de cursos que seran desplegados en la vista
  listaCursos: string[] = ['Java','JavaScript', 'PHP', 'C#','Angular'];
  //Variable que utiliza el btn para mostrar u ocultar la lista
  habilitar: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  //Metodo que setea la variable habilitar
  visibilidad(){
    this.habilitar = (this.habilitar == true)?false:true;
  }

}
