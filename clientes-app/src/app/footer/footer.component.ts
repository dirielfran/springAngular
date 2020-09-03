//Se importa el decorator @Component
import { Component } from '@angular/core';
// Se crea su decorador 
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    //Se registra footer.component.css en el footer.component.ts
    styleUrls: ['./footer.component.css']
})
// Se importa el decorador 
export class FooterComponent {
    //se crea variable de tipo any (generico)
    public author: any = {nombre: "Elvis", apellido:"Areiza"};
}
