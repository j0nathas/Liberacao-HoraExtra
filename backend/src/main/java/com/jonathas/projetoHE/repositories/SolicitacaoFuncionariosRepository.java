package com.jonathas.projetoHE.repositories;

import com.jonathas.projetoHE.model.SolicitacaoExportProjection;
import com.jonathas.projetoHE.model.SolicitacoesFuncionarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SolicitacaoFuncionariosRepository extends JpaRepository<SolicitacoesFuncionarios, Long> {

    List<SolicitacoesFuncionarios> findAllBySolicitacoesId(Long id);

    @Query(value = """
    SELECT 
        CONVERT(VARCHAR(10), s.inicio, 103) AS Data,
        s.departamento AS Departamento,
        funcionarios.Nome_Empresa AS Empresa,
        departamentos.DESC_DEPARTAMENTO AS LocalDaHoraExtra,
        funcionarios.Codigo_Registro AS Chapa,
        funcionarios.Nome_Registro AS Nome,
        s.turno AS Turno,

        s.inicio AS HoraInicio,
        s.fim    AS HoraTermino,

        RIGHT(
            '00' + CAST(DATEDIFF(MINUTE, s.inicio, s.fim) / 60 AS VARCHAR(5)),
            2
        ) + ':' +
        RIGHT(
            '00' + CAST(ABS(DATEDIFF(MINUTE, s.inicio, s.fim) % 60) AS VARCHAR(2)),
            2
        ) AS TempoGastoTotal,

        mm.Descricao AS MotivoMacro,

        s.motivo_detalhado AS Justificativa,

        NULL AS Transporte,

        CASE WHEN s.status = 'pending' THEN  'PEDIR AUTORIZAÇÃO' 
        WHEN s.status = 'signed' THEN 'APROVADO'    
        ELSE 'error' END AS Autorizado
    FROM [Projeto_HE].[dbo].[solicitacoes_funcionarios]

    INNER JOIN solicitacoes s
        ON solicitacoes_funcionarios.id_soli = s.id

    INNER JOIN Cadastros_HE funcionarios
        ON solicitacoes_funcionarios.id_funcionario = funcionarios.ID

    INNER JOIN Dept_HE departamentos
        ON solicitacoes_funcionarios.id_maquina = departamentos.COD_MAQUINA

    INNER JOIN Motivos_Macro mm
        ON s.id_motivo_macro = mm.ID
            
    WHERE s.inicio >= :inicio
    AND s.inicio < DATEADD(DAY, 1, :fim)

    ORDER BY s.inicio ASC
    """, nativeQuery = true)
    List<SolicitacaoExportProjection> buscarSolicitacoesParaExportacao(LocalDate inicio,  LocalDate fim);
}
