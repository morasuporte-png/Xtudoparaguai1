
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
  categories: Category[];
}

export const getCategoryTree = (): Department[] => {
  const tree: Department[] = [];

  Object.entries(supplierCategories).forEach(([fileName, cats]) => {
    // Clean department name: "2_DECORAÇÃO.xlsx" -> "DECORAÇÃO"
    const deptLabel = fileName.replace(/^\d+_/, '').replace('.xlsx', '').toUpperCase();
    const deptId = deptLabel.toLowerCase().replace(/\s+/g, '-');

    // Try to find existing meta from CATEGORY_MAP (matching by label or slug)
    const existingMeta = Object.values(CATEGORY_MAP).find(
      m => m.label.toUpperCase() === deptLabel || deptLabel.includes(m.label.toUpperCase())
    );

    const department: Department = {
      id: deptId,
      label: deptLabel,
      iconPath: existingMeta?.iconPath,
      gradient: existingMeta?.gradient,
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
