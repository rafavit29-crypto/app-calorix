// This modal is actually implemented inline in RemindersScreen.tsx
// Keeping this file as a placeholder if a dedicated modal component is preferred.
// For now, the implementation for adding/editing reminders is directly within RemindersScreen.tsx

// import React, { useState, useEffect } from 'react';
// import Modal from '../components/Modal';
// import InputField from '../components/InputField';
// import Button from '../components/Button';
// import ToggleSwitch from '../components/ToggleSwitch';
// import { Reminder } from '../types/reminder';

// interface RemindersModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (reminder: Reminder) => void;
//   editingReminder: Reminder | null;
// }

// const RemindersModal: React.FC<RemindersModalProps> = ({ isOpen, onClose, onSave, editingReminder }) => {
//   const [name, setName] = useState('');
//   const [time, setTime] = useState('08:00');
//   const [active, setActive] = useState(true);

//   useEffect(() => {
//     if (isOpen && editingReminder) {
//       setName(editingReminder.name);
//       setTime(editingReminder.time);
//       setActive(editingReminder.active);
//     } else if (isOpen) {
//       setName('');
//       setTime('08:00');
//       setActive(true);
//     }
//   }, [isOpen, editingReminder]);

//   const handleSubmit = () => {
//     if (name.trim() === '') {
//       alert('O nome do lembrete não pode ser vazio.');
//       return;
//     }
//     const newReminder: Reminder = {
//       id: editingReminder?.id || String(Date.now()), // Use existing ID or generate new
//       name,
//       time,
//       active,
//     };
//     onSave(newReminder);
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={editingReminder ? 'Editar Lembrete' : 'Criar Lembrete'}>
//       <div className="space-y-4">
//         <InputField label="Nome do Lembrete" id="reminder-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Beber água" />
//         <InputField label="Horário" id="reminder-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
//         <div className="flex items-center justify-between">
//           <span className="text-gray-700 dark:text-gray-200">Ativo</span>
//           <ToggleSwitch isOn={active} handleToggle={() => setActive(!active)} />
//         </div>
//         <Button onClick={handleSubmit} className="w-full">
//           {editingReminder ? 'Salvar Alterações' : 'Criar Lembrete'}
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default RemindersModal;
