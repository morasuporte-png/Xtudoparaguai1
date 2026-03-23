
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
  iconNode?: React.ReactNode;
  categories: Category[];
}

// SVG factory for premium category icons
const CatIcon = (c: React.ReactNode): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm transition-transform" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {c}
  </svg>
);

// Default visual identity per department
const DEPT_DEFAULTS: Record<string, { gradient: string; emoji: string; iconNode: React.ReactNode }> = {
  'DECORAÇÃO':            { gradient: 'from-rose-500 to-pink-700',     emoji: '🏠', iconNode: CatIcon(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>) },
  'PET':                  { gradient: 'from-amber-500 to-orange-700',  emoji: '🐾', iconNode: CatIcon(<><path d="M12 4.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-2.5 2.5A2.5 2.5 0 019.5 7 2.5 2.5 0 0112 4.5zM17.5 7.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5zM6.5 7.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-2.5 2.5A2.5 2.5 0 014 10a2.5 2.5 0 012.5-2.5zM12 11.5c2 0 4.5 1 5.5 3 1.5 3 .5 6-1 7s-3 .5-4.5.5-3 .5-4.5-.5-2.5-4-1-7c1-2 3.5-3 5.5-3z" /></>) },
  'COSMÉTICOS':           { gradient: 'from-purple-500 to-violet-700', emoji: '💄', iconNode: CatIcon(<><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></>) },
  'TÊXTIL':               { gradient: 'from-blue-500 to-cyan-700',     emoji: '👕', iconNode: CatIcon(<><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></>) },
  'TEXTIL':               { gradient: 'from-blue-500 to-cyan-700',     emoji: '👕', iconNode: CatIcon(<><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></>) },
  'ALIMENTAÇÃO SAUDÁVEL': { gradient: 'from-green-500 to-emerald-700', emoji: '🥗', iconNode: CatIcon(<><path d="M11 20A7 7 0 0 1 4 13V4a1 1 0 0 1 1-1h9a7 7 0 0 1 7 7v9a1 1 0 0 1-1 1h-9Z"/><path d="M11 20v2"/><path d="M14.5 16.5 11 13"/></>) },
  'KIDS E TEENS':         { gradient: 'from-yellow-400 to-orange-500', emoji: '🧸', iconNode: CatIcon(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4m-2-2v4" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="11.5" r=".5" fill="currentColor" /></>) },
  'MULTIMARCAS':          { gradient: 'from-indigo-500 to-purple-700', emoji: '🏪', iconNode: CatIcon(<><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>) },
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

    const defaults = DEPT_DEFAULTS[deptLabel] || { gradient: 'from-slate-600 to-slate-800', emoji: '📦', iconNode: CatIcon(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>) };

    const department: Department = {
      id: deptId,
      label: deptLabel,
      iconPath: existingMeta?.iconPath,
      gradient: existingMeta?.gradient || defaults.gradient,
      emoji: defaults.emoji,
      iconNode: defaults.iconNode,
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
