import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string;

  constructor() { }

  ngOnInit(): void {

    this.client = new Client();
    //Se hace la conexion Broker registrado como endpoint en el backend
    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-webSocket");
    }
    //tareas cuando nos conectamos, donde frame contiene toda la informacion de la conexion
    this.client.onConnect = (frame) => {
      console.log('Conectado: '+this.client.connected+' : '+frame);
      this.conectado = true;

      //Nos susbcribimos al evento de envio de mensaje
      this.client.subscribe('/chat/mensaje', (e)=>{
        //Se captura y se castea el mensaje del endpoint backend (Broker)
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);
        //Se valida si existe color, tipo de mensaje del broker y si el usuario del broker es igual al usuario
        if(!this.mensaje.color && mensaje.tipo == 'NUEVO_USUARIO' && this.mensaje.username == mensaje.username){
          //Se añade al color del mensaje el que obtenemos del broker
          this.mensaje.color = mensaje.color;
        }

        //Se agrega mensaje al array de mensajes
        this.mensajes.push(mensaje);
        console.log(mensaje);
      });

      //Escucha si un usuario esta escribiendo
      this.client.subscribe('/chat/escribiendo',e=>{
        this.escribiendo = e.body;
        setTimeout(() => this.escribiendo="", 3000);
      });

      //Se envia mensaje al Broker
      this.mensaje.tipo = 'NUEVO_USUARIO';
      this.client.publish({destination: '/app/mensaje', body: JSON.stringify(this.mensaje)});
    }
    //tareas cuando nos desconectamos
    this.client.onDisconnect = (frame) => {
      console.log('Desconectado: '+!this.client.connected+' : '+frame);
      this.conectado = false;
    }

  }

  conectar(): void{
    //Se inicializa la conecion
    this.client.activate();
  }

  desconectar(): void{
    //Se desactiva la conecion
    this.client.deactivate();
  }

  enviarMensaje(): void {
    this.mensaje.tipo = 'MENSAJE';
    this.client.publish({destination: '/app/mensaje', body: JSON.stringify(this.mensaje)});
    this.mensaje.texto ="";
  }

  //Metodo que  publica si un usuario esta escribiendo
  escribiendoEvento(): void {
    this.client.publish({destination: '/app/escribiendo', body: this.mensaje.username});
  }
}
