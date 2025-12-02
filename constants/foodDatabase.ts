
import { MealItem } from '../types/meal';

export interface FoodProduct {
  barcode: string;
  name: string;
  portion: number; // in grams or ml
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

export const MOCK_BARCODE_DATABASE: Record<string, FoodProduct> = {
  '7891000123456': {
    barcode: '7891000123456',
    name: 'Iogurte Natural Desnatado',
    portion: 170,
    calories: 78,
    protein: 6.8,
    carbs: 9.1,
    fat: 0,
    imageUrl: 'https://via.placeholder.com/150?text=Iogurte'
  },
  '7891000987654': {
    barcode: '7891000987654',
    name: 'Barra de Cereal Castanha e Chocolate',
    portion: 25,
    calories: 95,
    protein: 1.2,
    carbs: 15,
    fat: 3.5,
    imageUrl: 'https://via.placeholder.com/150?text=Barra+Cereal'
  },
  '7896005800019': {
    barcode: '7896005800019',
    name: 'Aveia em Flocos Finos',
    portion: 30,
    calories: 104,
    protein: 4.3,
    carbs: 17,
    fat: 2.2,
    imageUrl: 'https://via.placeholder.com/150?text=Aveia'
  },
  '7894321710005': {
    barcode: '7894321710005',
    name: 'Refrigerante Zero Açúcar',
    portion: 350,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    imageUrl: 'https://via.placeholder.com/150?text=Refri+Zero'
  }
};
