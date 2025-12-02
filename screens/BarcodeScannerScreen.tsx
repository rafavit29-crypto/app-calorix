
import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import { MOCK_BARCODE_DATABASE, FoodProduct } from '../constants/foodDatabase';
import { MealItem, MealCategory } from '../types/meal';
import { v4 as uuidv4 } from 'uuid';

interface BarcodeScannerScreenProps {
  onSave: (item: Omit<MealItem, 'id' | 'timestamp'>, category: MealCategory) => void;
  onCancel: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> = ({ onSave, onCancel, showToast }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<FoodProduct | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('Lanche');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    portion: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const mealCategories: MealCategory[] = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];

  // Start Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        showToast('Não foi possível acessar a câmera.', 'error');
        setManualEntry(true);
        setScanning(false);
      }
    };

    if (scanning && !manualEntry) {
      startCamera();
    }

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanning, manualEntry, showToast]);

  // Simulate Barcode Detection
  useEffect(() => {
    if (isCameraActive && scanning && !manualEntry) {
      const timer = setTimeout(() => {
        // Simulate finding a random product from DB
        const keys = Object.keys(MOCK_BARCODE_DATABASE);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const product = MOCK_BARCODE_DATABASE[randomKey];

        handleProductFound(product);
      }, 3000); // 3 seconds scan simulation

      return () => clearTimeout(timer);
    }
  }, [isCameraActive, scanning, manualEntry]);

  const handleProductFound = (product: FoodProduct) => {
    setScannedProduct(product);
    setFormData({
      name: product.name,
      portion: product.portion,
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat
    });
    setScanning(false);
    showToast('Produto detectado!', 'success');
  };

  const handleManualNotFound = () => {
    setManualEntry(true);
    setScanning(false);
    setFormData({
      name: '',
      portion: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast('O nome do produto é obrigatório.', 'error');
      return;
    }

    onSave({
      name: formData.name,
      portion: formData.portion,
      calories: formData.calories,
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat,
      source: 'manual', // Even if scanned, saving it effectively makes it a user entry
      imageUrl: scannedProduct?.imageUrl
    }, selectedCategory);
  };

  // View: Scanner
  if (scanning && !manualEntry) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="relative flex-1 bg-black overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-48 border-2 border-white/50 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-[scan_2s_linear_infinite]"></div>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
            </div>
          </div>
          
          <div className="absolute top-8 left-0 w-full text-center">
             <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
               Aponte para o código de barras
             </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-t-2xl flex flex-col gap-3">
           <Button onClick={() => handleProductFound(MOCK_BARCODE_DATABASE['7891000123456'])} variant="secondary" className="w-full">
             Simular Detecção (Debug)
           </Button>
           <div className="flex gap-3">
             <Button onClick={onCancel} variant="danger" className="flex-1">
               Cancelar
             </Button>
             <Button onClick={handleManualNotFound} variant="secondary" className="flex-1">
               Digitar Código
             </Button>
           </div>
        </div>
        
        <style>{`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // View: Edit / Result
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {scannedProduct ? 'Produto Encontrado' : 'Adicionar Produto'}
      </h2>

      <Card className="p-6 space-y-4">
        {scannedProduct?.imageUrl && (
          <div className="flex justify-center mb-4">
            <img src={scannedProduct.imageUrl} alt="Product" className="h-32 object-contain rounded-md" />
          </div>
        )}

        <InputField 
          label="Nome do Produto" 
          id="prod-name" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField 
            label="Porção (g/ml)" 
            id="prod-portion" 
            type="number"
            value={formData.portion} 
            onChange={(e) => setFormData({...formData, portion: Number(e.target.value)})} 
          />
          <InputField 
            label="Calorias (kcal)" 
            id="prod-cal" 
            type="number"
            value={formData.calories} 
            onChange={(e) => setFormData({...formData, calories: Number(e.target.value)})} 
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <InputField 
            label="Prot (g)" 
            id="prod-prot" 
            type="number"
            value={formData.protein} 
            onChange={(e) => setFormData({...formData, protein: Number(e.target.value)})} 
          />
          <InputField 
            label="Carb (g)" 
            id="prod-carb" 
            type="number"
            value={formData.carbs} 
            onChange={(e) => setFormData({...formData, carbs: Number(e.target.value)})} 
          />
          <InputField 
            label="Gord (g)" 
            id="prod-fat" 
            type="number"
            value={formData.fat} 
            onChange={(e) => setFormData({...formData, fat: Number(e.target.value)})} 
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Refeição</label>
          <select
            className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-gray-800 dark:text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MealCategory)}
          >
            {mealCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onCancel} variant="secondary" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Salvar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BarcodeScannerScreen;
