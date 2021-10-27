import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Pedido } from '../model/Pedido';
import { Produto } from '../model/Produto';
import { AlertasService } from '../service/alertas.service';
import { PedidoService } from '../service/pedido.service';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  nome = environment.nome;
  email = environment.email;

  pedido: Pedido = new Pedido();
  listaDePedidos: Pedido[];
  qtdItensProdutos: number;

  listaDeProdutos: Produto[];
  memoria: Produto[] = [];
  memoriaV: Produto[] = [];

  listaRemocao: Produto[];

  idCarrinho = environment.pedidos;
  valorCarrinho: number;

  idMemoria: number;

  nomex: string

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
    private alertas: AlertasService


  ) { }

  ngOnInit() {

    window.scroll (0,0)
    
    if(environment.token == '') {
      this.router.navigate(['/login']);
    }

    if(localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    }

    this.findByIdProdutosCarrinho();
    this.findByIdPedido();

  }

  /* ################## DADOS CARRINHO USUARIO ################## */

  findByIdProdutosCarrinho() {
    this.pedidoService.findAllByProdutosPedidos(environment.pedidos).subscribe((resp: Produto[]) => {
      this.listaDeProdutos = resp;

      try {
        this.qtdItensProdutos = this.listaDeProdutos.length;

      }catch(erro){
        //console.log('NAO FOI POSSIVEL CALCULAR OS ITENS!!');
      }

      try {
        let contador: number = 0;
        let repeticao: number = 0;

        // CRIA UM VETOR PARA SERVIR DE REFERENCIA NAS VALIDACOES
        let pivo: number[] = [this.listaDeProdutos.length];

        for(let i = 0; i < this.listaDeProdutos.length; i++) {
          // ARMAZENA O ID DENTRO DO PIVO PARA SERVIR DE REFERENCIA
          pivo[i] = this.listaDeProdutos[i].idProduto;

          // ENTRA NO LOOP DO PRODUTO TRABALHO NO MOMENTO
          for(let item of this.listaDeProdutos) {
            // VERIFICA SE O VALOR DO PIVO E O MESMO DO ID DO LOOP ATUAL NO QUAL ESTAMOS TRABALHANDO
            if(pivo[i] == item.idProduto) {
              // ADICIONA UM AO CONTADOR
              contador++;

            }

            // ATRIBUI O VALOR DO CONTADOR A QTD DE UM DETERMINADO PRODUTO DE ACORDO COM A QTD DESSE MESMO PRODUTO NA LISTA
            this.listaDeProdutos[i].qtdPedidoProduto = contador;

          }

          // INSERE O PRIMEIRO VALOR PARA INICIALIZAR OS VALORES NO VETOR
          this.memoria = this.listaDeProdutos;

          // ZERA O CONTADO PARA REMOCMECAR UMA NOVA CONTAGEM
          contador = 0;

        }

      }catch(erro){
        //console.log('OCORREU UM ERRO AO GERAR A LISTA DE PRODUTOS');

      }

      try{
        /* AGRUPA OS ITENS REPETIDOS DENTRO DO ARRAY */
        this.listaDeProdutos = this.listaDeProdutos.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.nome === item.nome && t.descricao === item.descricao
          ))
        )

      }catch(erro){
        //console.log('OCORREU UM ERRO AO AGRUPAR O ARRAY);

      }

    })

  }

  findByIdPedido() {
    this.pedidoService.findByIdPedido(environment.pedidos).subscribe((resp: Pedido) => {
      this.pedido = resp;

      /* ARREDONDA O VALOR DECIMAL DEIXANDO SOMENTE 2 CASAS APOS A VIRGULA */
      this.valorCarrinho = Number(this.pedido.valorTotal.toFixed(2));

    })

  }

  // findByIdPedido() {
  //   this.pedidoService.findByIdPedido(environment.pedidos).subscribe((resp: Pedido) => {
  //     this.pedido = resp;

  //   })

  // }

  removerDoCarrinho(idProduto: number, idPedido: number) {
    this.pedidoService.removerItemDoCarrinho(idProduto, idPedido).subscribe(() => {
      this.alertas.showAlertSuccess('Item removido do carrinho!');

      this.findByIdProdutosCarrinho();
      this.findByIdPedido();

    })

  }

  /* EM NOSSA ESTRUTURA ESSE METODO NAO SERA UTILIZADO, ESTA MAIS AQUI POR FINS DIDATICOS */
  postPedido() {
    this.pedidoService.postPedido(this.pedido).subscribe((resp: Pedido) => {
      this.pedido = resp;

      this.alertas.showAlertSuccess('Pedido cadastrado com sucesso');

      this.router.navigate(['/pedido']);

    })

  }


  /*putProduto(idProduto: number, idPedido: number) {
    this.pedidoService.putProduto(idProduto, idPedido).subscribe(() => {
      this.router.navigate(['/pedido']);
    })
  }*/

}
