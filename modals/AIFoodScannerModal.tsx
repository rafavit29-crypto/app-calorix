import React, { useState, useRef } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { MealItem, MealCategory } from '../types/meal';

interface AIFoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MealItem, 'id' | 'timestamp'>, category: MealCategory) => void;
}

// Mock AI Service Response
const MOCK_AI_RESULTS = [
  { name: 'Prato Feito (Arroz, Feijão, Frango)', calories: 550, protein: 35, carbs: 60, fat: 12, portion: 400 },
  { name: 'Salada Caesar com Frango', calories: 320, protein: 25, carbs: 10, fat: 18, portion: 250 },
  { name: 'Açaí com Granola', calories: 480, protein: 8, carbs: 70, fat: 15, portion: 300 },
  { name: 'Pão de Queijo (3 unidades)', calories: 270, protein: 6, carbs: 25, fat: 16, portion: 90 },
];

const AIFoodScannerModal: React.FC<AIFoodScannerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'review'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<Omit<MealItem, 'id' | 'timestamp' | 'source'>>({
    name: '',
    portion: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('Almoço');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setStep('upload');
    setImagePreview(null);
    setScannedData({ name: '', portion: 0, calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setStep('scanning');
      simulateAIAnalysis();
    }
  };

  const simulateAIAnalysis = () => {
    setTimeout(() => {
      // Pick a random mock result to simulate AI recognition
      const randomResult = MOCK_AI_RESULTS[Math.floor(Math.random() * MOCK_AI_RESULTS.length)];
      setScannedData({
        ...randomResult,
      });
      setStep('review');
    }, 2500); // 2.5s delay to simulate "Thinking"
  };

  const handleConfirm = () => {
    onSave({
      ...scannedData,
      source: 'ai',
      imageUrl: imagePreview || undefined
    }, selectedCategory);
    handleClose();
  };

  const mealCategories: MealCategory[] = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Scanner de Alimentos IA">
      <div className="min-h-[300px]">
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-300 font-medium">Tire uma foto do seu prato</p>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              Abrir Câmera / Galeria
            </Button>
          </div>
        )}

        {/* Step 2: Scanning */}
        {step === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
            <div className="relative w-32 h-32">
               {/* Pulse Effect */}
               <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
               <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                 {imagePreview && <img src={imagePreview} alt="Scanning" className="w-full h-full object-cover" />}
               </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white animate-pulse">Analisando imagem...</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Identificando ingredientes e calculando porções</p>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4 bg-primary/10 p-3 rounded-lg border border-primary/20">
               <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {imagePreview && <img src={imagePreview} alt="Analyzed" className="w-full h-full object-cover" />}
               </div>
               <div>
                  <h4 className="font-bold text-primary text-sm uppercase tracking-wide">IA Identificou:</h4>
                  <p className="text-gray-800 dark:text-gray-100 font-medium">{scannedData.name}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                 <InputField 
                    label="Nome do Prato" 
                    id="ai-name" 
                    value={scannedData.name} 
                    onChange={(e) => setScannedData({...scannedData, name: e.target.value})}
                 />
              </div>
              <InputField 
                label="Porção (g)" 
                id="ai-portion" 
                type="number" 
                value={scannedData.portion} 
                onChange={(e) => setScannedData({...scannedData, portion: Number(e.target.value)})}
              />
              <InputField 
                label="Calorias" 
                id="ai-cals" 
                type="number" 
                value={scannedData.calories} 
                onChange={(e) => setScannedData({...scannedData, calories: Number(e.target.value)})}
              />
              <InputField 
                label="Proteína (g)" 
                id="ai-prot" 
                type="number" 
                value={scannedData.protein} 
                onChange={(e) => setScannedData({...scannedData, protein: Number(e.target.value)})}
              />
              <InputField 
                label="Carbo (g)" 
                id="ai-carb" 
                type="number" 
                value={scannedData.carbs} 
                onChange={(e) => setScannedData({...scannedData, carbs: Number(e.target.value)})}
              />
              <InputField 
                label="Gordura (g)" 
                id="ai-fat" 
                type="number" 
                value={scannedData.fat} 
                onChange={(e) => setScannedData({...scannedData, fat: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Adicionar em</label>
              <select
                className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-gray-800 dark:text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MealCategory)}
              >
                {mealCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <Button onClick={handleConfirm} className="w-full mt-4">
              Confirmar e Salvar
            </Button>
            <button 
              onClick={resetModal} 
              className="w-full text-center text-sm text-gray-500 mt-2 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Escanear novamente
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIFoodScannerModal;