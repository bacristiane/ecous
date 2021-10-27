import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../model/Usuario';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: Usuario = new Usuario
  confirmarSenha: string

  termos: boolean

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertas: AlertasService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0)
  }

  confirmSenha(event: any) {
    this.confirmarSenha = event.target.value
  }
  
  cadastrar() {
    console.log("user"+JSON.stringify(this.user))
    console.log("confirmarSenha"+ this.confirmarSenha)
 
    if (this.user.senha != this.confirmarSenha) {
      this.alertas.showAlertDanger ('As senhas estão incorretas.')
      
    }
    else {
      this.authService.cadastrar(this.user).subscribe((resp: Usuario) =>{
        this.user = resp 
        this.router.navigate(['/login'])
        this.alertas.showAlertSuccess('Usuário cadastrado com sucesso!')
      }, error => {
        if (error.status == 500) {
          this.alertas.showAlertDanger("Este email já está cadastrado em nosso sistema! Por favor, utilize outro email.")
        }
      })
    }
  }

  verificaCheckboxFalso() {
    return !this.termos
  }

  verificaCheckbox() {
    return this.termos
  }
}
