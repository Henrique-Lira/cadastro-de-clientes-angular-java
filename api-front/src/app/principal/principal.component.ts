import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {

  novoTelefone: string = '';

  cliente = new Cliente();

  btnCadastro = true;

  tabela = true;

  clientes: Cliente[] = [];

  tipos: any[] = [
    { nome: 'Pessoa Física', placeholderDocumento: 'CPF', placeholderrgOuIe: 'RG', documentoMask: '000.000.000-00', },
    { nome: 'Pessoa Jurídica', placeholderDocumento: 'CNPJ', placeholderrgOuIe: 'IE', documentoMask: '00.000.000/0000-00' },
  ];
  placeholderDocumento: string = 'CPF ou CNPJ';
  placeholderrgOuIe: string = 'RG ou IE';
  documentoMask!: string;
  termoBusca: string = '';
  filtroAtual!: string;

  constructor(
    private servico: ClienteService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  selecionar(): void {
    this.servico.selecionar()
      .subscribe(retorno => this.clientes = retorno)
  }

  async cadastrar(): Promise<void> {
    const documentoExiste = await this.servico.verificarExistenciaDocumento(this.cliente.documento).toPromise();

    if (documentoExiste) {
      alert('CPF/CNPJ já está cadastrado.');
      return;
    }

    this.cliente.dataCadastro = new Date();
    this.cliente.ativo = true;

    this.servico.cadastrar(this.cliente)
      .subscribe(retorno => {
        this.clientes.push(retorno);
        this.cliente = new Cliente();
        alert('Cliente cadastrado com sucesso!');
      });
  }

  selecionarCliente(posicao: number): void {
    this.cliente = this.clientes[posicao];
    this.btnCadastro = false;
    this.tabela = false;
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

  editar(): void {

    this.servico.editar(this.cliente)
      .subscribe(retorno => {

        let posicao = this.clientes.findIndex(obj => {
          return obj.codigo == retorno.codigo;
        });

        this.clientes[posicao] = retorno;

        this.cliente = new Cliente();

        this.btnCadastro = true;

        this.tabela = true;

        alert('Cliente alterado com sucesso!');

      });
  }

  remover(): void {

    this.servico.remover(this.cliente.codigo)
      .subscribe(retorno => {

        let posicao = this.clientes.findIndex(obj => {
          return obj.codigo == this.cliente.codigo;
        });

        this.clientes.splice(posicao, 1)

        this.cliente = new Cliente();

        this.btnCadastro = true;

        this.tabela = true;

        alert('Cliente removido com sucesso!');

      });
  }

  cancelar() {
    this.cliente = new Cliente();

    this.btnCadastro = true;

    this.tabela = true;
  }

  pessoaFisicaOuJuridica(): void {
    const tipoSelecionado = this.tipos.find(tipo => tipo.nome === this.cliente.tipo);
    if (tipoSelecionado) {
      this.placeholderDocumento = tipoSelecionado.placeholderDocumento;
      this.placeholderrgOuIe = tipoSelecionado.placeholderrgOuIe;
      this.documentoMask = tipoSelecionado.documentoMask;
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

  ngOnInit(): void {
    this.selecionar();
  }

}
