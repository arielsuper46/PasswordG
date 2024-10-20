import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

interface PasswordGeneratorProps {
  defaultLength?: number;
}

// Mover esta función aquí arriba, antes de usarla en useState
function generateRandomPassword(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let newPassword = "";
  for (let i = 0; i < length; i++) {
    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newPassword;
}

function PasswordGenerator({ defaultLength = 16 }: PasswordGeneratorProps) {
  const [password, setPassword] = useState<string>(generateRandomPassword(defaultLength));
  const [length, setLength] = useState<number>(defaultLength);
  const lowercaseRef = useRef<HTMLInputElement>(null);
  const uppercaseRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const symbolRef = useRef<HTMLInputElement>(null);

  // Memorizar la función para que su referencia no cambie en cada render
  const updatePassword = useCallback((): void => {
    const includeLowercase = lowercaseRef.current?.checked || false;
    const includeUppercase = uppercaseRef.current?.checked || false;
    const includeNumber = numberRef.current?.checked || false;
    const includeSymbol = symbolRef.current?.checked || false;

    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+=";

    let chars = "";
    if (includeLowercase) chars += lowercaseChars;
    if (includeUppercase) chars += uppercaseChars;
    if (includeNumber) chars += numberChars;
    if (includeSymbol) chars += symbolChars;

    if (chars === "") {
      setPassword(""); // Si no se seleccionó ningún tipo de carácter
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(newPassword);
  }, [length]);

  // Efecto que actualiza la contraseña cuando cambia la longitud
  useEffect(() => {
    updatePassword();
  }, [length, updatePassword]);

  // Función para manejar el cambio de longitud de la contraseña
  const handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newLength = parseInt(event.target.value);
    setLength(newLength);
  };

  // Copiar la contraseña al portapapeles
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(password);
    toast.success("Contraseña copiada al portapapeles");
  };

  return (
    <div className="container">
      <h2 className="title">Generador de contraseñas</h2>
      <div className="result">
        <div className="result__viewbox" id="result">
          {password}
          <i className="bi bi-copy" onClick={copyToClipboard}></i>
        </div>
      </div>

      <div className="length range__slider" data-min="5" data-max="32">
        <div className="length__title field-title">Longitud: {length}</div>
        <input
          id="slider"
          type="range"
          min="5"
          max="32"
          value={length}
          onChange={handleLengthChange}
        />
      </div>

      <div className="settings">
        <span className="settings__title field-title">Configuraciones:</span>
        <div className="setting">
          <input
            ref={lowercaseRef}
            type="checkbox"
            id="lowercase"
            defaultChecked
            onChange={updatePassword}
          />
          <label htmlFor="lowercase">Incluir Minúsculas</label>
        </div>
        <div className="setting">
          <input ref={uppercaseRef} type="checkbox" id="uppercase" onChange={updatePassword} />
          <label htmlFor="uppercase">Incluir Mayúsculas</label>
        </div>
        <div className="setting">
          <input
            ref={numberRef}
            type="checkbox"
            id="number"
            defaultChecked
            onChange={updatePassword}
          />
          <label htmlFor="number">Incluir Números</label>
        </div>
        <div className="setting">
          <input ref={symbolRef} type="checkbox" id="symbol" onChange={updatePassword} />
          <label htmlFor="symbol">Incluir Símbolos</label>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator;
