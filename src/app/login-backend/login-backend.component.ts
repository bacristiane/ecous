import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { UsuarioLogin } from '../model/UsuarioLogin';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login-backend',
  templateUrl: './login-backend.component.html',
  styleUrls: ['./login-backend.component.css']
})
export class LoginBackendComponent implements OnInit {


  userLogin: UsuarioLogin = new UsuarioLogin()

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertas: AlertasService

  ) { }

  ngOnInit() {
    window.scroll(0, 0)
  }
  entrar() {
    this.auth.entrar(this.userLogin).subscribe((resp: UsuarioLogin) => {
      this.userLogin = resp

      environment.token = this.userLogin.token
      environment.nome = this.userLogin.nome
      environment.idUsuario = this.userLogin.idUsuario
      environment.pedidos = this.userLogin.pedidos.id;
      environment.listaDeDesejos = this.userLogin.listaDeDesejos.id;


      this.router.navigate(['/backend'])
    }, erro =>{
      if(erro.status == 400){
        this.alertas.showAlertDanger('Usuário e/ou senha incorretos.')
      }
    })
  }
}