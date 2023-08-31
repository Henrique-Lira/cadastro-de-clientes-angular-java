package br.com.projeto.api.controle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.projeto.api.modelo.Cliente;
import br.com.projeto.api.repositorio.Repositorio;

@RestController
@CrossOrigin(origins = "*")
public class Controle {

    @Autowired
    private Repositorio acao;

    @GetMapping("/")
    public Iterable<Cliente> selecionar(@RequestParam(name = "filtro", defaultValue = "todos") String filtro) {
        if (filtro.equals("ativos")) {
            return acao.findByAtivoTrue();
        } else if (filtro.equals("inativos")) {
            return acao.findByAtivoFalse();
        } else {
            return acao.findAll();
        }
    }

    @PostMapping("/")
    public Cliente cadastrar(@RequestBody Cliente c) {
        return acao.save(c);
    }

    @PutMapping("/")
    public Cliente editar(@RequestBody Cliente c) {
        return acao.save(c);
    }

    @DeleteMapping("/{codigo}")
    public void remover(@PathVariable long codigo) {
        acao.deleteById(codigo);
    }

    @PutMapping("/{codigo}/alterar-ativo")
    public Cliente alterarAtivo(@PathVariable long codigo, @RequestBody Cliente c) {
        Cliente clienteExistente = acao.findById(codigo).orElse(null);
        if (clienteExistente != null) {
            clienteExistente.setAtivo(c.isAtivo());
            return acao.save(clienteExistente);
        }
        return null;
    }

    @GetMapping("/buscarPorNome/{nome}")
    public Iterable<Cliente> buscarPorNome(@PathVariable String nome) {
        return acao.findByNomeContainingIgnoreCase(nome);
    }
}