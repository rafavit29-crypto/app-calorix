// This modal is actually implemented inline in FastingScreen.tsx
// Keeping this file as a placeholder if a dedicated modal component is preferred.
// For now, the implementation for starting/controlling fasting is directly within FastingScreen.tsx

// import React, { useState, useEffect } from 'react';
// import Modal from '../components/Modal';
// import InputField from '../components/InputField';
// import Button from '../components/Button';
// import { FastingState } from '../types/fasting';

// interface FastingControlModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onStartFasting: (durationHours: number) => void;
//   currentFastingState: FastingState | null;
// }

// const FastingControlModal: React.FC<FastingControlModalProps> = ({ isOpen, onClose, onStartFasting, currentFastingState }) => {
//   const [durationInput, setDurationInput] = useState(16); // Default 16 hours

//   useEffect(() => {
//     if (isOpen && currentFastingState?.isActive) {
//       setDurationInput(currentFastingState.durationHours);
//     } else if (isOpen) {
//       setDurationInput(16); // Reset to default when opening for new fasting
//     }
//   }, [isOpen, currentFastingState]);

//   const handleSubmit = () => {
//     if (durationInput <= 0) {
//       alert('A duração do jejum deve ser maior que 0 horas.');
//       return;
//     }
//     onStartFasting(durationInput);
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Jejum">
//       <p className="text-gray-700 dark:text-gray-200 mb-4">Selecione a duração do seu jejum em horas:</p>
//       <InputField
//         label="Duração (horas)"
//         id="fastingDuration"
//         type="number"
//         value={durationInput}
//         onChange={(e) => setDurationInput(parseInt(e.target.value) || 0)}
//         min="1"
//         max="24"
//         className="mb-6"
//       />
//       <Button onClick={handleSubmit} className="w-full">
//         Confirmar
//       </Button>
//     </Modal>
//   );
// };

// export default FastingControlModal;
