import React, { useRef, useState } from 'react';

function SignaturePad({ onSignatureCapture, parcelId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignatureData(null);
  };

  const saveSignature = async () => {
    const signatureImage = canvasRef.current.toDataURL();
    setSignatureData(signatureImage);

    try {
      // Envoyer la signature au backend
      const response = await fetch('https://saas-livraison-cotonou.vercel.app/parcels/' + parcelId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Livré',
          signature: signatureImage
        })
      });

      if (response.ok) {
        onSignatureCapture(signatureImage);
        alert('✅ Signature enregistrée ! Livraison confirmée !');
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'enregistrement');
      console.error(error);
    }
  };

  return (
    <div className="signature-pad">
      <h3>✍️ Signature du client</h3>
      <p className="hint">Veuillez signer ci-dessous pour confirmer la livraison</p>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="signature-buttons">
        <button className="btn-clear" onClick={clearSignature}>
          🗑️ Effacer
        </button>
        <button className="btn-save" onClick={saveSignature}>
          ✅ Confirmer signature
        </button>
      </div>

      {signatureData && (
        <div className="signature-preview">
          <p>✅ Signature enregistrée</p>
          <img src={signatureData} alt="Signature" />
        </div>
      )}
    </div>
  );
}

export default SignaturePad;
