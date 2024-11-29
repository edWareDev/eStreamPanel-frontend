export const timeoutPromise = (onError) => new Promise((_, reject) => setTimeout(() => reject(new Error(`${onError}: Tiempo de espera agotado.`)), 5000))
