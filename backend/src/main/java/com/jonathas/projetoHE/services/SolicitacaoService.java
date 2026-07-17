package com.jonathas.projetoHE.services;

import com.jonathas.projetoHE.dto.post.SolicitacaoDTO;
import com.jonathas.projetoHE.dto.post.SolicitacaoFuncionarioDTO;
import com.jonathas.projetoHE.model.*;
import com.jonathas.projetoHE.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {
    private final SolicitacaoRepository solicitacaoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final RespHeRepository respHeRepository;
    private final MotivosMacroRepository motivosMacroRepository;
    private final FuncionariosRepository funcionariosRepository;
    private final SolicitacaoFuncionariosRepository solicitacoesFuncionariosRepository;

    @Transactional
    public Solicitacoes salvar(SolicitacaoDTO dto){

        RespHE usuario = respHeRepository.findById(dto.id_user())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        MotivosMacro motivo = motivosMacroRepository.findById((long) dto.id_motivo_macro())
                .orElseThrow(() -> new RuntimeException("Motivo não encontrado"));

        Solicitacoes solicitacao = new Solicitacoes();

        solicitacao.setUsuario(usuario);
        solicitacao.setMotivosMacro(motivo);
        solicitacao.setMotivoDetalhado(dto.motivo_detalhado());
        solicitacao.setDepartamento(dto.departamento());
        solicitacao.setTurno(dto.turno());
        solicitacao.setInicio(dto.inicio());
        solicitacao.setFim(dto.fim());
        solicitacao.setData(dto.data());

        solicitacao = solicitacaoRepository.save(solicitacao);

        for (SolicitacaoFuncionarioDTO item : dto.funcionarios()) {

            Funcionarios funcionario = funcionariosRepository.findById((long) item.id_funcionario())
                    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

            Departamento maquina = departamentoRepository
                    .findByCodMaquina(item.id_maquina())
                    .orElseThrow(() -> new RuntimeException("Máquina não encontrada"));

            SolicitacoesFuncionarios relacao = new SolicitacoesFuncionarios();

            relacao.setSolicitacoes(solicitacao);
            relacao.setFuncionarios(funcionario);
            relacao.setMaquinas(maquina);

            solicitacoesFuncionariosRepository.save(relacao);
        }

        return solicitacao;
    }
}
