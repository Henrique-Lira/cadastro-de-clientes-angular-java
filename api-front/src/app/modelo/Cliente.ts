export class Cliente {
  codigo!: number;
  nome!: string;
  tipo!: string;
  documento!: string;
  rgOuIe!: string;
  dataCadastro!: Date;
  ativo!: boolean;
  telefones: string[] = [];
}
