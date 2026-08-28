export const hoje = new Date().toISOString().split('T')[0] + 'T00:00';

export function novoForm(id) {
    return {
        id,
        planta: '',
        tipo: '',
        motivoMacro: '',
        motivoMacroId: '',
        departamento: '',
        inicio: '',
        fim: '',
        turno: '',
        justificativas: []
    };
}

export function validarFormularios(forms) {
    const formularioInvalido = forms.some((f) =>
        !f.planta || !f.motivoMacro || !f.departamento || !f.inicio || !f.fim || !f.turno ||
        f.justificativas.length === 0 ||
        f.justificativas.some(j => j.funcionarios.length === 0)
    );

    if (formularioInvalido) {
        return { valid: false, toast: "Preencha todos os campos e adicione funcionários às máquinas!" };
    }
    return { valid: true, toast: null };
}