import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CadastroClienteComponent } from '../cadastro-cliente/cadastro-cliente.component';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';

@Component({
  selector: 'app-listagem-clientes',
  templateUrl: './listagem-clientes.component.html',
  styleUrls: ['./listagem-clientes.component.scss']
})
export class ListagemClientesComponent {

  clienteOriginal: Cliente | null = null;
  formCliente!: FormGroup;
  cliente = new Cliente();
  clientes: Cliente[] = [];
  btnCadastro = true;
  tipos: any[] = [
    { nome: 'Pessoa Física', placeholderDocumento: 'CPF', placeholderrgOuIe: 'RG', documentoMask: '000.000.000-00', },
    { nome: 'Pessoa Jurídica', placeholderDocumento: 'CNPJ', placeholderrgOuIe: 'IE', documentoMask: '00.000.000/0000-00' },
  ];
  placeholderDocumento: string = 'CPF ou CNPJ';
  placeholderrgOuIe: string = 'RG ou IE';
  documentoMask!: string;
  novoTelefone: string = '';
  termoBusca: string = '';
  filtroAtual = 'todos';

  constructor(
    private servico: ClienteService,
    private dialog: MatDialog,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.selecionar();
    this.formCliente = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required]),
      documento: new FormControl('', [Validators.required]),
      rgOuIe: new FormControl('')
    });
  }

  abrirDialogCadastro(): void {
    const dialogRef = this.dialog.open(CadastroClienteComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.selecionar();
        this.atualizarListagem();
      }
    });
  }

  abrirDialogEditar(posicao: number): void {
    const dialogRef = this.dialog.open(CadastroClienteComponent, {
      width: '300px',
      data: { posicao:  posicao}
    });
    dialogRef.componentInstance.emEdicao = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.selecionar();
        this.atualizarListagem();
      }
    });
  }

  selecionar(): void {
    this.servico.selecionar()
      .subscribe(retorno => this.clientes = retorno)
  }

  selecionarCliente(posicao: number): void {
    this.clienteOriginal = { ...this.clientes[posicao] };
    this.cliente = { ...this.clientes[posicao] };
    this.btnCadastro = false;
  }

  removerCliente(cliente: Cliente): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente excluir o cliente ${cliente.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servico.remover(cliente.codigo).subscribe(() => {
          const posicao = this.clientes.findIndex((obj) => obj.codigo == cliente.codigo);
          this.clientes.splice(posicao, 1);
          Swal.fire({
            icon: 'success',
            title: 'Cliente removido com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  }


  alternarAtivoCliente(cliente: Cliente): void {
    const novoStatus = !cliente.ativo;
    this.servico.editar({ ...cliente, ativo: novoStatus })
      .subscribe(retorno => {
        cliente.ativo = retorno.ativo;
        Swal.fire({
          icon: 'success',
          title: 'Status do cliente alterado com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        });
      });
    this.atualizarListagem();
  }


  atualizarListagem(){
    if(this.filtroAtual === 'ativos'){
      setTimeout(() => {
        this.filtrarClientes('ativos')
      }, 100);
    } else if (this.filtroAtual === 'inativos'){
      setTimeout(() => {
        this.filtrarClientes('inativos')
      }, 100);
    }
  }

  buscarPorNome(): void {
    if (this.termoBusca.trim() === '') {
      this.selecionar();
    } else {
      this.servico.buscarPorNome(this.termoBusca)
        .subscribe(retorno => this.clientes = retorno);
    }
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.selecionar();
  }

  filtrarClientes(filtro: 'ativos' | 'inativos' | 'todos'): void {
    if (filtro === 'ativos') {
      this.servico.filtrarClientesAtivos()
        .subscribe(retorno => this.clientes = retorno);
    } else if (filtro === 'inativos') {
      this.servico.filtrarClientesInativos()
        .subscribe(retorno => this.clientes = retorno);
    } else {
      this.selecionar();
    }
    this.filtroAtual = filtro;
  }

  adicionarTelefone(cliente: Cliente): void {
    if (cliente.novoTelefone.trim() !== '') {
      cliente.telefones.push(cliente.novoTelefone);
      this.servico.editar(cliente).subscribe(
        () => {
          cliente.novoTelefone = '';
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Telefone adicionado com sucesso!',
          });
        },
        (error) => {
          console.error('Erro ao adicionar telefone:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao adicionar o telefone',
          });
        }
      );
    }
  }

  removerTelefone(cliente: Cliente, idx: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Tem certeza que deseja remover este telefone?',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        cliente.telefones.splice(idx, 1);
        this.servico.editar(cliente).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Telefone removido com sucesso!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (error) => {
            console.error('Erro ao remover telefone:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro ao remover telefone',
              text: 'Ocorreu um erro ao remover o telefone. Por favor, tente novamente mais tarde.'
            });
          }
        );
      }
    });
  }

  filtrarClientesPorNome(): void {
    if (this.termoBusca.trim() === '') {
      this.selecionar();
    } else {
      this.servico.buscarPorNome(this.termoBusca)
        .subscribe(retorno => this.clientes = retorno);
    }
  }

}
