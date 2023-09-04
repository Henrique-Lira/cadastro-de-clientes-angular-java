import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.scss']
})
export class CadastroClienteComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CadastroClienteComponent>,
    private servico: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  clienteOriginal: Cliente | null = null;
  formCliente!: FormGroup;
  cliente = new Cliente();
  clientes: Cliente[] = [];
  btnCadastro = true;
  tabela = true;
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
  emEdicao = false;

  ngOnInit(): void {
    this.aguardarEdicaoConcluida().subscribe(edicaoConcluida => {
      if (edicaoConcluida) {
        this.aguardarPosicaoSelecionada().subscribe(posicao => {
          if (posicao !== undefined) {
            this.selecionarCliente(posicao);
          }
        });
      }
    });

    this.selecionar();
    this.formCliente = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required]),
      documento: new FormControl('', [Validators.required]),
      rgOuIe: new FormControl('')
    });
  }

  aguardarEdicaoConcluida(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const intervalId = setInterval(() => {
        if (this.emEdicao === true) {
          clearInterval(intervalId);
          observer.next(this.emEdicao);
          observer.complete();
        }
      }, 100);
    }).pipe(take(1));
  }

  aguardarPosicaoSelecionada(): Observable<number | undefined> {
    return new Observable<number | undefined>(observer => {
      const intervalId = setInterval(() => {
        if (this.data.posicao !== undefined) {
          clearInterval(intervalId);
          observer.next(this.data.posicao);
          observer.complete();
        }
      }, 100);
    }).pipe(take(1));
  }

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
        this.dialogRef.close('success');
      });
  }

  selecionarCliente(posicao: number): void {
    this.clienteOriginal = { ...this.clientes[posicao] };
    this.cliente = { ...this.clientes[posicao] };
    this.btnCadastro = false;
    this.tabela = false;
  }

  editar(): void {
    // Verificar se o documento foi alterado e se já existe para outro cliente
    if (this.cliente.documento !== this.clienteOriginal?.documento) {
      this.servico.verificarExistenciaDocumentoEditando(this.cliente.documento, this.cliente.codigo).subscribe(
        documentoExiste => {
          if (documentoExiste) {
            alert('CPF/CNPJ já está cadastrado.');
            return;
          } else {
            this.realizarEdicao();
          }
        },
        error => {
          console.error('Erro ao verificar existência de documento:', error);
          alert('Ocorreu um erro ao verificar o documento.');
        }
      );
    } else {
      this.realizarEdicao();
    }
  }

  private realizarEdicao(): void {
    this.servico.editar(this.cliente).subscribe(
      retorno => {
        let posicao = this.clientes.findIndex(obj => {
          return obj.codigo == retorno.codigo;
        });

        this.clientes[posicao] = retorno;

        this.cliente = new Cliente();
        this.clienteOriginal = null;

        this.btnCadastro = true;
        this.tabela = true;

        alert('Cliente alterado com sucesso!');
        this.dialogRef.close('success');
        this.selecionar(); // Atualizar a lista de clientes
      },
      error => {
        console.error('Erro ao editar cliente:', error);
        alert('Ocorreu um erro ao editar o cliente.');
      }
    );
  }

  cancelar() {
    this.cliente = new Cliente();
    this.btnCadastro = true;
    this.tabela = true;
    this.dialogRef.close('success');
  }

  pessoaFisicaOuJuridica(): void {
    const tipoSelecionado = this.tipos.find(tipo => tipo.nome === this.cliente.tipo);
    if (tipoSelecionado) {
      this.placeholderDocumento = tipoSelecionado.placeholderDocumento;
      this.placeholderrgOuIe = tipoSelecionado.placeholderrgOuIe;
      this.documentoMask = tipoSelecionado.documentoMask;
    }
  }
}
