import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CadastroClienteComponent } from '../cadastro-cliente/cadastro-cliente.component';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {

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
    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      this.servico.remover(cliente.codigo).subscribe(retorno => {
        const posicao = this.clientes.findIndex(obj => obj.codigo == cliente.codigo);
        this.clientes.splice(posicao, 1);
        alert('Cliente removido com sucesso!');
      });
    }
  }

  alternarAtivoCliente(cliente: Cliente): void {
    const novoStatus = !cliente.ativo;
    this.servico.editar({ ...cliente, ativo: novoStatus })
      .subscribe(retorno => {
        cliente.ativo = retorno.ativo;
      });
  this.atualizarListagem()
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
      cliente.telefones.push(cliente.novoTelefone); // Adiciona o telefone à lista de telefones do cliente
      this.servico.editar(cliente).subscribe(
        () => {
          cliente.novoTelefone = ''; // Limpa o campo
          alert('Telefone adicionado com sucesso!');
        },
        (error) => {
          console.error('Erro ao adicionar telefone:', error);
          alert('Ocorreu um erro ao adicionar o telefone.');
        }
      );
    }
  }

  removerTelefone(cliente: Cliente, idx: number): void {
    cliente.telefones.splice(idx, 1);
    this.servico.editar(cliente).subscribe(
      () => {
        alert('Telefone removido com sucesso!');
      },
      (error) => {
        console.error('Erro ao remover telefone:', error);
        alert('Ocorreu um erro ao remover o telefone.');
      }
    );
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
