import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import ToggleSwitch from '../components/ToggleSwitch';
import { Reminder } from '../types/reminder';
import { AuthUser } from '../types/user';
import { Toast } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RemindersScreenProps {
  currentUser: AuthUser;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  showToast: (message: string, type: Toast['type']) => void;
}

const RemindersScreen: React.FC<RemindersScreenProps> = ({ currentUser, reminders, setReminders, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [reminderName, setReminderName] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00'); // Default time
  const [reminderActive, setReminderActive] = useState(true);

  const openAddModal = () => {
    setEditingReminder(null);
    setReminderName('');
    setReminderTime('08:00');
    setReminderActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setReminderName(reminder.name);
    setReminderTime(reminder.time);
    setReminderActive(reminder.active);
    setIsModalOpen(true);
  };

  const handleSaveReminder = () => {
    if (reminderName.trim() === '') {
      showToast('O nome do lembrete não pode ser vazio.', 'error');
      return;
    }

    if (editingReminder) {
      setReminders(prev => prev.map(r => r.id === editingReminder.id ? { ...r, name: reminderName, time: reminderTime, active: reminderActive } : r));
      showToast('Lembrete atualizado com sucesso!', 'success');
    } else {
      const newReminder: Reminder = {
        id: uuidv4(),
        name: reminderName,
        time: reminderTime,
        active: reminderActive,
      };
      setReminders(prev => [...prev, newReminder]);
      showToast('Lembrete criado com sucesso!', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    showToast('Lembrete excluído.', 'info');
  };

  const handleToggleActive = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    showToast('Status do lembrete atualizado.', 'info');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Meus Lembretes</h2>

      <Button onClick={openAddModal} className="w-full md:w-auto">
        + Criar Novo Lembrete
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {reminders.length > 0 ? (
          reminders.map(reminder => (
            <Card key={reminder.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{reminder.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{reminder.time} {reminder.active ? '(Ativo)' : '(Inativo)'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <ToggleSwitch isOn={reminder.active} handleToggle={() => handleToggleActive(reminder.id)} />
                <Button variant="secondary" onClick={() => openEditModal(reminder)} className="px-3 py-1 text-sm">
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteReminder(reminder.id)} className="px-3 py-1 text-sm">
                  Excluir
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">Nenhum lembrete configurado. Crie um para começar!</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingReminder ? 'Editar Lembrete' : 'Criar Novo Lembrete'}>
        <InputField
          label="Nome do Lembrete"
          id="reminderName"
          value={reminderName}
          onChange={(e) => setReminderName(e.target.value)}
          placeholder="Ex: Beber água"
          className="mb-4"
        />
        <InputField
          label="Horário"
          id="reminderTime"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="mb-4"
        />
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-700 dark:text-gray-200">Ativo</span>
          <ToggleSwitch isOn={reminderActive} handleToggle={() => setReminderActive(!reminderActive)} />
        </div>
        <Button onClick={handleSaveReminder} className="w-full">
          {editingReminder ? 'Salvar Alterações' : 'Criar Lembrete'}
        </Button>
      </Modal>
    </div>
  );
};

export default RemindersScreen;