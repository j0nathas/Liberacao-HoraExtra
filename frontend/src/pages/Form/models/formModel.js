// models/formModel.js
// Camada de Model: apenas dados e regras de negócio, sem React e sem efeitos colaterais.

export const hoje = new Date().toISOString().split('T')[0] + 'T00:00';

/**
 * Cria um novo formulário vazio.
 */
export function novoForm(id) {
    return {
        id,
        motivoMacro: '',
        motivoDetalhado: '',
        departamento: '',
        inicio: '',
        fim: '',
        turno: '',
        funcionarios: []
    };
}

export function validarFormularios(forms) {
    const formularioInvalido = forms.some((f) =>
        f.motivoMacro === '' ||
        f.motivoDetalhado === '' ||
        f.departamento === '' ||
        f.inicio === '' ||
        f.fim === '' ||
        f.turno === '' ||
        f.funcionarios.length === 0
    );

    if (formularioInvalido) {
        return { valid: false, toast: "Preencha todos os campos do formulário!" };
    }

    return { valid: true, toast: null };
}