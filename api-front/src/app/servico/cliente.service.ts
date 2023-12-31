import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../modelo/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  selecionar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url);
  }

  cadastrar(obj: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, obj);
  }

  editar(obj: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.url, obj);
  }

  remover(codigo: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + codigo)
  }

  buscarPorNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}/buscarPorNome/${nome}`);
  }

  filtrarClientesAtivos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}?filtro=ativos`);
  }

  filtrarClientesInativos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}?filtro=inativos`);
  }

  verificarExistenciaDocumento(documento: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/verificarExistenciaDocumento/${documento}`);
  }

  adicionarTelefone(codigo: number, telefone: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.url}/${codigo}/adicionar-telefone`, telefone);
  }

  verificarExistenciaDocumentoEditando(documento: string, codigo: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/verificarExistenciaDocumentoEditando/${documento}/${codigo}`);
  }

}
