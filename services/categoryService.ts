
import supplierCategories from '../data/supplier_categories.json';
import { CATEGORY_MAP } from '../constants';
import React from 'react';

export interface SubCategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  subCategories: SubCategory[];
}

export interface Department {
  id: string;
  label: string;
  iconPath?: React.ReactNode;
  gradient?: string;
  emoji?: string;
  categories: Category[];
}

// Default visual identity per department
const DEPT_DEFAULTS: Record<string, { gradient: string; emoji: string }> = {
  'DECORAÇÃO':            { gradient: 'from-rose-500 to-pink-700',     emoji: '🏠' },
  'PET':                  { gradient: 'from-amber-500 to-orange-700',  emoji: '🐾' },
  'COSMÉTICOS':           { gradient: 'from-purple-500 to-violet-700', emoji: '💄' },
  'TÊXTIL':               { gradient: 'from-blue-500 to-cyan-700',     emoji: '👕' },
  'TEXTIL':               { gradient: 'from-blue-500 to-cyan-700',     emoji: '👕' },
  'ALIMENTAÇÃO SAUDÁVEL': { gradient: 'from-green-500 to-emerald-700', emoji: '🥗' },
  'KIDS E TEENS':         { gradient: 'from-yellow-400 to-orange-500', emoji: '🧸' },
  'MULTIMARCAS':          { gradient: 'from-indigo-500 to-purple-700', emoji: '🏪' },
};

export const getCategoryTree = (): Department[] => {
  const tree: Department[] = [];

  Object.entries(supplierCategories).forEach(([fileName, cats]) => {
    // Skip the supplier catalog file (not a product department)
    if (fileName.includes('FORNECEDOR')) return;

    // Clean department name: "2_DECORAÇÃO.xlsx" -> "DECORAÇÃO", "5_TEXTIL_.xlsx" -> "TÊXTIL"
    let deptLabel = fileName.replace(/^\d+_/, '').replace('.xlsx', '').replace(/_+$/, '').toUpperCase();
    // Fix accented name: TEXTIL -> TÊXTIL
    if (deptLabel === 'TEXTIL') deptLabel = 'TÊXTIL';
    const deptId = deptLabel.toLowerCase().replace(/\s+/g, '-').replace(/[áàãâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i').replace(/[óòõôö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/[ç]/g, 'c').replace(/[ê]/g, 'e').replace(/[^a-z0-9-]/g, '');

    // Try to find existing meta from CATEGORY_MAP (matching by label or slug)
    const existingMeta = Object.values(CATEGORY_MAP).find(
      m => m.label.toUpperCase() === deptLabel || deptLabel.includes(m.label.toUpperCase())
    );

    const defaults = DEPT_DEFAULTS[deptLabel] || { gradient: 'from-slate-600 to-slate-800', emoji: '📦' };

    const department: Department = {
      id: deptId,
      label: deptLabel,
      iconPath: existingMeta?.iconPath,
      gradient: existingMeta?.gradient || defaults.gradient,
      emoji: defaults.emoji,
      categories: []
    };

    Object.entries(cats).forEach(([catLabel, subCats]) => {
      const catId = catLabel.toLowerCase().replace(/\s+/g, '-');
      
      const category: Category = {
        id: catId,
        label: catLabel,
        subCategories: (subCats as string[]).map(sub => ({
          id: sub.toLowerCase().replace(/\s+/g, '-'),
          label: sub
        }))
      };

      department.categories.push(category);
    });

    tree.push(department);
  });

  return tree;
};
