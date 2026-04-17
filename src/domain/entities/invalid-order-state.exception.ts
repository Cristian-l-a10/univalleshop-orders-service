export class InvalidOrderStateException extends Error {
  constructor(
    public readonly currentState: string,
    public readonly attemptedAction: string,
    message?: string
  ) {
    // Si no se pasa un mensaje personalizado, generamos uno por defecto
    const defaultMessage = message || 
      `No se puede realizar la acción "${attemptedAction}" porque la orden está en estado "${currentState}".`;
    
    super(defaultMessage);
    
    // Asegura que el nombre de la excepción sea el de la clase y no solo "Error"
    this.name = 'InvalidOrderStateException';

    // Captura la traza de la pila (stack trace) en entornos V8 (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidOrderStateException);
    }
  }
}