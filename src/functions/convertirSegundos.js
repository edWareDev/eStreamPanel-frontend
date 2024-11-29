export const convertirSegundos = (segundos) => {
    let dias = Math.floor(segundos / (24 * 60 * 60));
    segundos %= 24 * 60 * 60;
    let horas = Math.floor(segundos / (60 * 60));
    segundos %= 60 * 60;
    let minutos = Math.floor(segundos / 60);
    segundos %= 60;

    return dias > 0 ? `${dias}D ${horas}h ${minutos}m ${segundos}s` : `${horas}h ${minutos}m ${segundos}s`;
}