import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { MealCategory, MealItem } from '../types/meal';
import { v4 as uuidv4 } from 'uuid';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (item: Omit<MealItem, 'id' | 'timestamp'>, category: MealCategory) => void;
  initialMealCategory: MealCategory | null;
  hideFoodInputs?: boolean; // If true, only shows meal category selection
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, onAddFood, initialMealCategory, hideFoodInputs = false }) => {
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState(0);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>(initialMealCategory || 'Café da manhã');

  useEffect(() => {
    if (isOpen) {
      setFoodName('');
      setPortion(0);
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
      setSelectedCategory(initialMealCategory || 'Café da manhã');
    }
  }, [isOpen, initialMealCategory]);

  const mealCategories: MealCategory[] = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];

  const handleSubmit = () => {
    if (foodName.trim() === '' && !hideFoodInputs) {
      alert('Por favor, insira o nome do alimento.');
      return;
    }
    const newItem: Omit<MealItem, 'id' | 'timestamp'> = {
      name: foodName,
      portion,
      calories,
      protein,
      carbs,
      fat,
    };
    onAddFood(newItem, selectedCategory);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={hideFoodInputs ? 'Selecionar Refeição' : 'Adicionar Alimento'}>
      <div className="space-y-4">
        {!hideFoodInputs && (
          <>
            <InputField
              label="Nome do Alimento"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Ex: Frango Grelhado"
            />
            <InputField
              label="Porção (g)"
              id="portion"
              type="number"
              value={portion}
              onChange={(e) => setPortion(parseInt(e.target.value) || 0)}
              min="0"
            />
            <InputField
              label="Calorias (kcal)"
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
              min="0"
            />
            <InputField
              label="Proteína (g)"
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
              min="0"
            />
            <InputField
              label="Carboidratos (g)"
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
              min="0"
            />
            <InputField
              label="Gordura (g)"
              id="fat"
              type="number"
              value={fat}
              onChange={(e) => setFat(parseInt(e.target.value) || 0)}
              min="0"
            />
          </>
        )}

        {initialMealCategory === null || hideFoodInputs ? (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Categoria da Refeição</label>
            <select
              className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200 text-gray-800 dark:text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MealCategory)}
            >
              {mealCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Adicionando a: <span className="font-semibold">{initialMealCategory}</span></p>
        )}

        <Button onClick={handleSubmit} className="w-full mt-4">
          {hideFoodInputs ? 'Adicionar Receita à Refeição' : 'Adicionar Alimento'}
        </Button>
      </div>
    </Modal>
  );
};

export default AddFoodModal;