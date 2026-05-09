export class InvalidOrderStateException extends Error {
  constructor(
    public readonly state: string,
    public readonly action: string,
    message?: string
  ) {
    // Si no se pasa un mensaje personalizado, generamos uno por defecto
    const defaultMessage = message || 
      `re de la excepción sea el ción "${action}" porque la orden está en estado "${state}".`;
    
    super(defaultMessage);
    
    // Asegura que el nombre de la excepción sea el de la clase y no solo "Error"
    this.name = 'InvalidOrderStateException';

    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidOrderStateException);
    }
  }
}