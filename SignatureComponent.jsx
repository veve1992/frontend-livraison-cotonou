import React, { useRef, useState } from 'react';

export default function SignatureComponent({ colis_id, onSuccess }) {
  const canvasRef = useRef(null);
  const [nomClient, setNomClient] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = async () => {
    if (!nomClient.trim()) {
      alert('⚠️ Veuillez entrer votre nom');
      return;
    }

    const signatureImage = canvasRef.current.toDataURL('image/png');

    try {
      const response = await fetch(`${API_URL}/parcels/${colis_id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nomClient,
          signature: signatureImage,
          statut: 'Livré'
        })
      });

      if (response.ok) {
        alert('✅ Colis livré et signé !');
        if (onSuccess) onSuccess();
      } else {
        alert('❌ Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
    }
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div style={styles.container}>
      <h3>✍️ Signature du Client</h3>
      
      <div style={styles.form}>
        <label>Nom du client:</label>
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={nomClient}
          onChange={(e) => setNomClient(e.target.value)}
          style={styles.input}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={styles.canvas}
      />

      <div style={styles.buttonGroup}>
        <button onClick={clearCanvas} style={{...styles.button, backgroundColor: '#ffc107'}}>
          🔄 Effacer
        </button>
        <button onClick={handleSubmit} style={{...styles.button, backgroundColor: '#28a745'}}>
          ✅ Confirmer la réception
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginTop: '20px'
  },
  form: {
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginTop: '8px',
    boxSizing: 'border-box'
  },
  canvas: {
    border: '2px solid #333',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'crosshair',
    display: 'block',
    width: '100%',
    marginBottom: '15px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};