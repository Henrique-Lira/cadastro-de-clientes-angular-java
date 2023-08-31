package br.com.projeto.api.repositorio;

import org.springframework.data.repository.CrudRepository;

import br.com.projeto.api.modelo.Cliente;

public interface Repositorio extends CrudRepository<Cliente, Long>{

    Iterable<Cliente> findByNomeContainingIgnoreCase(String nome);

    Iterable<Cliente> findByAtivoTrue();

    Iterable<Cliente> findByAtivoFalse();

    boolean existsByDocumento(String documento);

    boolean existsByDocumentoAndCodigoNot(String documento, long codigo);
    
}
