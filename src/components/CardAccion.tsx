import React, { useState } from 'react';

/**
 * CardAccion
 * -----------------------------------------------------------------------
 * Componente HIJO reutilizable.
 *
 * - Implementa useState para controlar el estado local de interacciones (clics).
 * - Padre -> Hijo: recibe por props título, descripción, textoBoton, icono, color.
 * - Hijo  -> Padre: notifica al padre ejecutando onAccion con los detalles.
 * -----------------------------------------------------------------------
 */
interface CardAccionProps {
  titulo: string;
  descripcion: string;
  textoBoton: string;
  icono?: string;
  color?: string;
  onAccion: (nombreAccion: string, detalle: string) => void;
}

const CardAccion: React.FC<CardAccionProps> = ({
  titulo,
  descripcion,
  textoBoton,
  icono = '⚡',
  color = 'var(--autometrica-primary)',
  onAccion,
}) => {
  // Estado local del componente hijo con useState y tipado estricto explícito en TypeScript
  const [contadorClics, setContadorClics] = useState<number>(0);
  const [ultimaInteraccion, setUltimaInteraccion] = useState<string>('Sin interacciones');

  const handleClick = (): void => {
    const nuevoConteo = contadorClics + 1;
    const hora = new Date().toLocaleTimeString('es-CO');
    setContadorClics(nuevoConteo);
    setUltimaInteraccion(`Clic #${nuevoConteo} a las ${hora}`);

    // Comunicación Hijo -> Padre mediante la función recibida por props
    onAccion(titulo, `Se presionó el botón "${textoBoton}" dentro de la tarjeta "${titulo}" (${nuevoConteo} veces).`);
  };

  return (
    <div className="card-accion" style={{ borderTop: `4px solid ${color}` }}>
      <h4>
        {icono} {titulo}
      </h4>
      <p>{descripcion}</p>
      
      <div className="card-accion-footer">
        <small className="card-stat-text">
          Interacciones: <strong>{contadorClics}</strong> | {ultimaInteraccion}
        </small>
        <button style={{ backgroundColor: color }} onClick={handleClick}>
          {textoBoton} {contadorClics > 0 && `(${contadorClics})`}
        </button>
      </div>
    </div>
  );
};

export default CardAccion;
