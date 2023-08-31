package br.com.projeto.api.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "clientes")
@Getter
@Setter
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private long codigo; // identificador

    private String nome;

    private String tipo; // pessoa física ou jurídica

    private String documento; // CPF ou CNPJ

    private String rgOuIe; // RG se pessoa física, IE se pessoa jurídica

    private Date dataCadastro; // Data de Cadastro

    private boolean ativo; // Ativo (se está ativo)

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "telefones", joinColumns = @JoinColumn(name = "cliente_codigo"))
    @Column(name = "numero")
    private List<String> telefones = new ArrayList<>(); // Adicione a propriedade de telefones
  

}
