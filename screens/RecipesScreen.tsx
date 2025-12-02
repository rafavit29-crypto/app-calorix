import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddFoodModal from '../modals/AddFoodModal';
import { Recipe } from '../types/recipe';
import { MealCategory, DailyLog } from '../types/meal';
import { AuthUser } from '../types/user';
import { Toast } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getTodayDateString } from '../utils/calculations';

const MOCK_RECIPES: Recipe[] = [
  {
    id: 'rec1',
    name: 'Salada de Frango Grelhado',
    description: 'Uma salada refrescante e rica em proteínas, perfeita para o almoço ou jantar.',
    ingredients: [
      '1 peito de frango (150g)',
      'Mix de folhas verdes (alface, rúcula)',
      '50g tomate cereja',
      '30g pepino',
      '20g cenoura ralada',
      'Molho de iogurte light (opcional)',
    ],
    preparation: [
      'Tempere o frango e grelhe até dourar.',
      'Corte o frango em fatias.',
      'Misture todos os vegetais em uma tigela.',
      'Adicione o frango e o molho (se usar).',
      'Sirva imediatamente.',
    ],
    nutritionalInfo: { calories: 350, protein: 40, carbs: 15, fat: 15 },
    mealItems: [
      { name: 'Peito de Frango Grelhado', portion: 150, calories: 250, protein: 40, carbs: 0, fat: 10 },
      { name: 'Salada de Folhas e Vegetais', portion: 150, calories: 100, protein: 0, carbs: 15, fat: 5 },
    ]
  },
  {
    id: 'rec2',
    name: 'Smoothie de Frutas Vermelhas e Proteína',
    description: 'Um smoothie nutritivo e energizante para o café da manhã ou lanche pós-treino.',
    ingredients: [
      '1 xícara de frutas vermelhas congeladas',
      '1 scoop de whey protein de baunilha',
      '1/2 xícara de leite vegetal (amêndoa/coco)',
      'Gelo a gosto',
    ],
    preparation: [
      'Combine todos os ingredientes no liquidificador.',
      'Bata até obter uma consistência suave.',
      'Sirva gelado.',
    ],
    nutritionalInfo: { calories: 280, protein: 25, carbs: 30, fat: 8 },
    mealItems: [
      { name: 'Frutas Vermelhas Congeladas', portion: 100, calories: 80, protein: 1, carbs: 20, fat: 0 },
      { name: 'Whey Protein Baunilha', portion: 30, calories: 120, protein: 24, carbs: 3, fat: 2 },
      { name: 'Leite Vegetal', portion: 120, calories: 80, protein: 0, carbs: 7, fat: 6 },
    ]
  },
  {
    id: 'rec3',
    name: 'Omelete de Legumes',
    description: 'Uma omelete rápida e saudável, rica em fibras e proteínas para qualquer refeição.',
    ingredients: [
      '2 ovos grandes',
      '50g espinafre picado',
      '30g pimentão picado',
      '10g cebola picada',
      'Sal e pimenta a gosto',
      'Fio de azeite',
    ],
    preparation: [
      'Bata os ovos com sal e pimenta.',
      'Refogue os legumes no azeite.',
      'Adicione os ovos batidos na frigideira.',
      'Cozinhe até firmar e dobre ao meio.',
      'Sirva quente.',
    ],
    nutritionalInfo: { calories: 200, protein: 14, carbs: 8, fat: 12 },
    mealItems: [
      { name: 'Ovos', portion: 100, calories: 140, protein: 12, carbs: 1, fat: 10 },
      { name: 'Vegetais Refogados', portion: 100, calories: 60, protein: 2, carbs: 7, fat: 2 },
    ]
  },
];

interface RecipesScreenProps {
  currentUser: AuthUser;
  dailyLogs: { [date: string]: DailyLog };
  setDailyLogs: React.Dispatch<React.SetStateAction<{ [date: string]: DailyLog }>>;
  showToast: (message: string, type: Toast['type']) => void;
}

const RecipesScreen: React.FC<RecipesScreenProps> = ({ currentUser, dailyLogs, setDailyLogs, showToast }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [mealCategoryToAdd, setMealCategoryToAdd] = useState<MealCategory | null>(null);

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
  };

  const handleAddRecipeToDiary = (recipe: Recipe) => {
    // Open modal to select meal category
    setSelectedRecipe(recipe); // Keep recipe selected for the modal
    setIsAddFoodModalOpen(true);
  };

  const handleConfirmAddRecipeItems = (category: MealCategory) => {
    if (selectedRecipe) {
      const today = getTodayDateString();
      setDailyLogs(prevLogs => {
        const currentMeals = prevLogs[today]?.meals || {
          'Café da manhã': [],
          'Almoço': [],
          'Jantar': [],
          'Lanche': [],
        };

        const newItems = selectedRecipe.mealItems.map(item => ({
          ...item,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        }));

        return {
          ...prevLogs,
          [today]: {
            ...prevLogs[today],
            date: today,
            meals: {
              ...currentMeals,
              [category]: [...currentMeals[category], ...newItems],
            },
            waterIntake: prevLogs[today]?.waterIntake || 0,
            caloriesConsumed: 0, // Recalculated by App.tsx
            proteinConsumed: 0,
            carbsConsumed: 0,
            fatConsumed: 0,
          },
        };
      });
      showToast(`Receita "${selectedRecipe.name}" adicionada ao diário!`, 'success');
      setIsAddFoodModalOpen(false);
      setSelectedRecipe(null);
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Receitas Saudáveis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_RECIPES.map(recipe => (
          <Card key={recipe.id} onClick={() => handleOpenRecipe(recipe)} className="p-4 cursor-pointer hover:shadow-md">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">{recipe.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{recipe.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{recipe.nutritionalInfo.calories} kcal</span>
              <span>{recipe.nutritionalInfo.protein}g Proteína</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <Modal isOpen={!!selectedRecipe && !isAddFoodModalOpen} onClose={handleCloseRecipe} title={selectedRecipe?.name || 'Detalhes da Receita'}>
        {selectedRecipe && (
          <div>
            <p className="text-gray-700 dark:text-gray-200 mb-4">{selectedRecipe.description}</p>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Ingredientes:</h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 mb-4">
              {selectedRecipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Modo de Preparo:</h4>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-200 mb-4">
              {selectedRecipe.preparation.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Informação Nutricional (por porção):</h4>
            <p className="text-gray-700 dark:text-gray-200">Calorias: {selectedRecipe.nutritionalInfo.calories} kcal</p>
            <p className="text-gray-700 dark:text-gray-200">Proteína: {selectedRecipe.nutritionalInfo.protein} g</p>
            <p className="text-gray-700 dark:text-gray-200">Carboidratos: {selectedRecipe.nutritionalInfo.carbs} g</p>
            <p className="text-gray-700 dark:text-gray-200">Gordura: {selectedRecipe.nutritionalInfo.fat} g</p>
            <Button onClick={() => handleAddRecipeToDiary(selectedRecipe)} className="mt-6 w-full">
              Adicionar ao Diário
            </Button>
          </div>
        )}
      </Modal>

      {/* Select Meal Category Modal (reusing AddFoodModal logic) */}
      <AddFoodModal
        isOpen={isAddFoodModalOpen}
        onClose={() => { setIsAddFoodModalOpen(false); setSelectedRecipe(null); }}
        onAddFood={(item, category) => {
          // This will not be directly called for recipe items, but the modal requires it
          // Instead, we just need the category selected.
          handleConfirmAddRecipeItems(category);
        }}
        hideFoodInputs={true} // Hide food input fields
        initialMealCategory={null} // Let user select
      />
    </div>
  );
};

export default RecipesScreen;