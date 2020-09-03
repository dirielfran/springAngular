//Se importa el Component para poderlo utilizar como decorador
import { Component } from '@angular/core';
//Se crea decorator
@Component({
    //Se agrega el selector
    selector: 'app-header',
    //Se agrega la plantilla html
    templateUrl: './header.component.html'
})
//Se exporta laa clase que sera importada en el module
export class HeaderComponent{
    title:string ='App Spring - Angular';
    yala:string = 'Yalita la hermosa';
}