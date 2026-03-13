
import React from 'react';
import { Product, Category, UserRole } from './types';

// Valid coupon codes
export const COUPONS: Record<string, { label: string; discount: number }> = {
  'XTUDO10': { label: '10% de desconto', discount: 0.10 },
  'FRETE0': { label: 'Bônus de R$ 20', discount: 0 }, // handled as fixed
  'PRIMECOMPRA': { label: '15% de desconto na 1ª compra', discount: 0.15 },
};

export const CATEGORIES: Category[] = [
  // ── Mais populares em CDE ──────────────────────────────────────────
  { id: '1', name: 'Celulares', icon: '📱', color: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'Produtos Apple', icon: '🍎', color: 'bg-slate-100 text-slate-700' },
  { id: '3', name: 'Notebook', icon: '💻', color: 'bg-sky-100 text-sky-600' },
  { id: '4', name: 'Games & Consoles', icon: '🎮', color: 'bg-violet-100 text-violet-700' },
  { id: '5', name: 'Eletrônicos', icon: '📺', color: 'bg-indigo-100 text-indigo-600' },
  { id: '6', name: 'Informática', icon: '⌨️', color: 'bg-cyan-100 text-cyan-600' },
  // ── Moda & Acessórios ──────────────────────────────────────────────
  { id: '7', name: 'Perfumes Premium', icon: '🧴', color: 'bg-rose-100 text-rose-600' },
  { id: '8', name: 'Relógios de Luxo', icon: '⌚', color: 'bg-amber-100 text-amber-700' },
  { id: '9', name: 'Óculos & Ótica', icon: '🕶️', color: 'bg-teal-100 text-teal-600' },
  { id: '10', name: 'Tênis Importados', icon: '👟', color: 'bg-orange-100 text-orange-600' },
  { id: '11', name: 'Malas & Viagem', icon: '🧳', color: 'bg-slate-100 text-slate-600' },
  // ── Câmeras & Foto ────────────────────────────────────────────────
  { id: '12', name: 'Câmeras & Foto', icon: '📷', color: 'bg-yellow-100 text-yellow-700' },
  { id: '13', name: 'Drones', icon: '🛸', color: 'bg-sky-100 text-sky-700' },
  { id: '14', name: 'Áudio & Fones', icon: '🎧', color: 'bg-purple-100 text-purple-700' },
  { id: '15', name: 'Smartwatch & Wearables', icon: '⌚', color: 'bg-green-100 text-green-700' },
  // ── Veículos & Automotivo ──────────────────────────────────────────
  { id: '16', name: 'Som Automotivo', icon: '🔊', color: 'bg-red-100 text-red-600' },
  { id: '17', name: 'Acessórios Automotivos', icon: '🚗', color: 'bg-zinc-100 text-zinc-700' },
  // ── Casa & Lazer ───────────────────────────────────────────────────
  { id: '18', name: 'Casa & Eletrodomésticos', icon: '🏠', color: 'bg-emerald-100 text-emerald-600' },
  { id: '19', name: 'Lazer & Hobby', icon: '⛺', color: 'bg-lime-100 text-lime-700' },
  { id: '20', name: 'Saúde & Beleza', icon: '💄', color: 'bg-pink-100 text-pink-600' },
  // ── Outros ────────────────────────────────────────────────────────
  { id: '21', name: 'Brinquedos & Kids', icon: '🧸', color: 'bg-yellow-100 text-yellow-600' },
  { id: '22', name: 'Ferramentas', icon: '🔧', color: 'bg-stone-100 text-stone-600' },
  { id: '23', name: 'Pet Shop', icon: '🐾', color: 'bg-amber-100 text-amber-600' },
  { id: '24', name: 'Ofertas & Promoções', icon: '🏷️', color: 'bg-rose-100 text-rose-600' },
];

export const MOCK_PRODUCTS: Product[] = [
  // ── CELULARES ──────────────────────────────────────────
  { id: 'p1', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Celulares', title: 'iPhone 15 Pro Max 256GB — Natural Titanium', description: 'Produto original lacrado. Versão Global.', priceBRL: 6890, comparePriceBRL: 8990, stock: 15, rating: 4.9, images: ['https://images.unsplash.com/photo-1696446702183-f3ec08b7df5d?w=600&q=80'], isVerified: true, specs: { Tela: '6.7"', Chip: 'A17 Pro' } },
  { id: 'p2', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Celulares', title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black', description: 'IA integrada e câmera de 200MP.', priceBRL: 5450, comparePriceBRL: 7999, stock: 25, rating: 4.9, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80'], isVerified: true, specs: { Chip: 'Snapdragon 8 Gen 3', Zoom: '100x' } },
  { id: 'p3', sellerId: 's4', sellerName: 'Cellshop', category: 'Celulares', title: 'Xiaomi 14 Ultra 512GB — Leica Camera', description: 'Câmera Leica 1", carregamento 90W.', priceBRL: 4200, comparePriceBRL: 5800, stock: 30, rating: 4.8, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'], isVerified: true, specs: { RAM: '16GB', Bateria: '5000mAh' } },
  { id: 'p4', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Celulares', title: 'Motorola Edge 50 Pro 256GB — Black Beauty', description: '144Hz pOLED, Dolby Atmos.', priceBRL: 1890, comparePriceBRL: 2500, stock: 45, rating: 4.5, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'], isVerified: false, specs: { Tela: 'pOLED 144Hz', RAM: '12GB' } },
  { id: 'p5', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Celulares', title: 'OnePlus 12 512GB — Silky Black', description: 'Snapdragon 8 Gen 3, carga 100W.', priceBRL: 3600, comparePriceBRL: 4900, stock: 18, rating: 4.7, images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80'], isVerified: true, specs: { CPU: 'SD 8 Gen 3', Charge: '100W Turbo' } },
  // ── APPLE ──────────────────────────────────────────────
  { id: 'p6', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Produtos Apple', title: 'iPhone 15 Pro 256GB — Blue Titanium', description: 'Titânio grau 5. Action button. USB-C.', priceBRL: 6100, comparePriceBRL: 8200, stock: 20, rating: 4.9, images: ['https://images.unsplash.com/photo-1695048132625-0a6df571e74d?w=600&q=80'], isVerified: true, specs: { Chip: 'A17 Pro', USB: 'USB-C 3.0' } },
  { id: 'p7', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Produtos Apple', title: 'AirPods Pro 2ª Geração USB-C', description: 'ANC adaptativo + modo Transparência.', priceBRL: 1280, comparePriceBRL: 1999, stock: 120, rating: 5.0, images: ['https://images.unsplash.com/photo-1588423771073-b8903fead714?w=600&q=80'], isVerified: true, specs: { Chip: 'H2', ANC: 'Adaptativo' } },
  { id: 'p8', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Produtos Apple', title: 'MacBook Air M3 15" — 8GB/512GB Midnight', description: 'O notebook mais fino e poderoso da Apple.', priceBRL: 9800, comparePriceBRL: 13500, stock: 7, rating: 4.9, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80'], isVerified: true, specs: { Chip: 'M3', Bateria: '18h' } },
  { id: 'p9', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Produtos Apple', title: 'iPad Pro M4 11" 256GB + Apple Pencil Pro', description: 'Display Ultra Retina XDR. Ultra fino.', priceBRL: 8200, comparePriceBRL: 11000, stock: 12, rating: 4.8, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'], isVerified: true, specs: { Chip: 'M4', Tela: 'OLED 11"' } },
  { id: 'p10', sellerId: 's4', sellerName: 'Cellshop', category: 'Produtos Apple', title: 'Apple Watch Series 9 — 45mm Midnight', description: 'Double Tap e display sempre ativo.', priceBRL: 3200, comparePriceBRL: 4500, stock: 35, rating: 4.7, images: ['https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80'], isVerified: true, specs: { Tela: '45mm OLED', Chip: 'S9' } },
  // ── GAMES ──────────────────────────────────────────────
  { id: 'p11', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Games & Consoles', title: 'PlayStation 5 Slim + 2 Controles DualSense', description: '4K HDR, 120fps, retrocompatível com PS4.', priceBRL: 3250, comparePriceBRL: 4400, stock: 42, rating: 4.8, images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80'], isVerified: true, specs: { Storage: '1TB SSD', FPS: '120' } },
  { id: 'p12', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Games & Consoles', title: 'Xbox Series X 1TB — Carbon Black', description: 'O console 4K mais poderoso da Microsoft.', priceBRL: 3100, comparePriceBRL: 4200, stock: 28, rating: 4.7, images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80'], isVerified: true, specs: { FPS: '120fps 4K', Quickresume: 'Sim' } },
  { id: 'p13', sellerId: 's4', sellerName: 'Cellshop', category: 'Games & Consoles', title: 'Nintendo Switch OLED — White Edition', description: 'Tela OLED 7", dock ajustável.', priceBRL: 1650, comparePriceBRL: 2200, stock: 60, rating: 4.9, images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80'], isVerified: true, specs: { Tela: 'OLED 7"', Storage: '64GB' } },
  { id: 'p14', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Games & Consoles', title: 'DualSense Edge Controle Pro PS5', description: 'Gatilhos ajustáveis e perfis customizáveis.', priceBRL: 890, comparePriceBRL: 1300, stock: 55, rating: 4.8, images: ['https://images.unsplash.com/photo-1592840448138-e5ff03b597fd?w=600&q=80'], isVerified: false, specs: { Tipo: 'Controle Pro', Wireless: 'BT 5.1' } },
  { id: 'p15', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Games & Consoles', title: 'Meta Quest 3 — 512GB VR Headset', description: 'Mixed Reality com passthrough Full Color.', priceBRL: 4100, comparePriceBRL: 5500, stock: 15, rating: 4.6, images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80'], isVerified: true, specs: { Storage: '512GB', Chip: 'Snapdragon XR2 Gen 2' } },
  // ── NOTEBOOK ───────────────────────────────────────────
  { id: 'p16', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Notebook', title: 'MacBook Air M2 13" 8GB/256GB Space Gray', description: 'Design slim, bateria de 18h.', priceBRL: 5900, comparePriceBRL: 8200, stock: 8, rating: 4.7, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'], isVerified: true, specs: { Chip: 'M2', Tela: '13.6" Retina' } },
  { id: 'p17', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Notebook', title: 'Dell XPS 15 — Intel i9/64GB/RTX 4070', description: 'Premier do mercado Windows para criação.', priceBRL: 14800, comparePriceBRL: 19500, stock: 5, rating: 4.9, images: ['https://images.unsplash.com/photo-1588600878108-578307a3cc9d?w=600&q=80'], isVerified: true, specs: { GPU: 'RTX 4070', RAM: '64GB DDR5' } },
  { id: 'p18', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Notebook', title: 'ASUS ROG Zephyrus G14 — Ryzen 9/OLED', description: 'Gamer premium ultra portátil.', priceBRL: 9400, comparePriceBRL: 12800, stock: 10, rating: 4.8, images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80'], isVerified: true, specs: { CPU: 'Ryzen 9 8945HS', Tela: 'OLED 120Hz' } },
  { id: 'p19', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Notebook', title: 'Lenovo ThinkPad X1 Carbon Gen 12 i7/32GB', description: 'Ultrabook mais leve para executivos.', priceBRL: 8700, comparePriceBRL: 11000, stock: 6, rating: 4.7, images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80'], isVerified: true, specs: { Peso: '1.12kg', CPU: 'Core Ultra 7' } },
  // ── PERFUMES ───────────────────────────────────────────
  { id: 'p20', sellerId: 's4', sellerName: 'Cellshop', category: 'Perfumes Premium', title: 'Bleu de Chanel Eau de Parfum 100ml', description: 'Elegância e frescor para o homem moderno.', priceBRL: 850, comparePriceBRL: 1250, stock: 60, rating: 5.0, images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80'], isVerified: true, specs: { Tipo: 'EDP', Volume: '100ml' } },
  { id: 'p21', sellerId: 's4', sellerName: 'Cellshop', category: 'Perfumes Premium', title: 'Dior Sauvage EDP 100ml — Original Lacrado', description: 'Um dos perfumes masculinos mais icônicos.', priceBRL: 780, comparePriceBRL: 1100, stock: 80, rating: 4.9, images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80'], isVerified: true, specs: { Nota: 'Amadeirado Aromático', Volume: '100ml' } },
  { id: 'p22', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Perfumes Premium', title: 'Coco Mademoiselle Chanel EDP 100ml', description: 'Floral oriental preferido das mulheres refinadas.', priceBRL: 920, comparePriceBRL: 1350, stock: 45, rating: 4.9, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80'], isVerified: true, specs: { Tipo: 'EDP Feminino', Volume: '100ml' } },
  { id: 'p23', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Perfumes Premium', title: 'Tom Ford Black Orchid EDP 100ml', description: 'Luxo olfativo com notas de orquídea preta.', priceBRL: 1250, comparePriceBRL: 1800, stock: 30, rating: 5.0, images: ['https://images.unsplash.com/photo-1588514912908-9ea8a81e9e86?w=600&q=80'], isVerified: true, specs: { Tipo: 'Unissex EDP', Nota: 'Oriental Floral' } },
  { id: 'p24', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Perfumes Premium', title: 'Creed Aventus EDP 100ml — 2024 Batch', description: 'O preferido dos presidentes. Notas frutadas.', priceBRL: 2100, comparePriceBRL: 3200, stock: 12, rating: 5.0, images: ['https://images.unsplash.com/photo-1607852088855-eeadd7c99b81?w=600&q=80'], isVerified: true, specs: { Nota: 'Frutal Amadeirado', Batch: '2024' } },
  // ── RELÓGIOS ───────────────────────────────────────────
  { id: 'p25', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Relógios de Luxo', title: 'Rolex Datejust 41 Wimbledon — Oystersteel', description: 'Ícone atemporal. Autenticidade verificada.', priceBRL: 52000, comparePriceBRL: 68000, stock: 3, rating: 5.0, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'], isVerified: true, specs: { Movimento: 'Cal. 3235', Caixa: '41mm' } },
  { id: 'p26', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Relógios de Luxo', title: 'Omega Seamaster 300m — Black Dial', description: 'O relógio do James Bond. COSC certificado.', priceBRL: 28000, comparePriceBRL: 38000, stock: 5, rating: 4.9, images: ['https://images.unsplash.com/photo-1548171916-c8fd5d33b4a3?w=600&q=80'], isVerified: true, specs: { Resistência: '300m', Movimento: 'Cal. 8800' } },
  { id: 'p27', sellerId: 's4', sellerName: 'Cellshop', category: 'Relógios de Luxo', title: 'TAG Heuer Carrera Chronograph 44mm', description: 'Racing heritage com cronógrafo automático.', priceBRL: 18000, comparePriceBRL: 24000, stock: 8, rating: 4.8, images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80'], isVerified: true, specs: { Tipo: 'Crono Auto', Caixa: '44mm SS' } },
  { id: 'p28', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Relógios de Luxo', title: 'Audemars Piguet Royal Oak Offshore — Blue', description: 'O hexágono mais famoso da relojoaria.', priceBRL: 195000, comparePriceBRL: 240000, stock: 2, rating: 5.0, images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80'], isVerified: true, specs: { Caixa: '42mm Titânio', Água: '100m' } },
  // ── DRONES ─────────────────────────────────────────────
  { id: 'p29', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Drones', title: 'DJI Air 3 + RC 2 — Fly More Combo', description: '4K HDR, câmeras duplas, 46 min autonomia.', priceBRL: 7800, comparePriceBRL: 10500, stock: 12, rating: 4.8, images: ['https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80'], isVerified: true, specs: { Video: '4K/60fps', Autonomia: '46 min' } },
  { id: 'p30', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Drones', title: 'DJI Mini 4 Pro + RC 2 — Fly More Combo', description: 'O mais leve com filmagem vertical 4K.', priceBRL: 5200, comparePriceBRL: 7000, stock: 18, rating: 4.9, images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80'], isVerified: true, specs: { Peso: '249g', Video: '4K/100fps' } },
  { id: 'p31', sellerId: 's4', sellerName: 'Cellshop', category: 'Drones', title: 'DJI Avata 2 FPV + Goggles 3 Combo', description: 'FPV de alta velocidade com óculos AR.', priceBRL: 8900, comparePriceBRL: 12000, stock: 8, rating: 4.7, images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80'], isVerified: true, specs: { POV: 'FPV 155°', Vel: '127km/h max' } },
  { id: 'p32', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Drones', title: 'DJI Osmo Action 4 — Adventure Combo', description: '4K com estabilização RockSteady 4.0.', priceBRL: 2400, comparePriceBRL: 3200, stock: 25, rating: 4.6, images: ['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&q=80'], isVerified: true, specs: { Video: '4K/120fps', IP: 'IP68' } },
  // ── ÁUDIO ──────────────────────────────────────────────
  { id: 'p33', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Áudio & Fones', title: 'Sony WH-1000XM5 Noise Cancelling', description: 'Melhor ANC do mercado. 30h de bateria.', priceBRL: 1650, comparePriceBRL: 2499, stock: 38, rating: 4.9, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'], isVerified: true, specs: { ANC: 'Dual Sensor', Bateria: '30h' } },
  { id: 'p34', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Áudio & Fones', title: 'Apple AirPods Max — Midnight', description: 'Over-ear premium com ANC adaptativo.', priceBRL: 4200, comparePriceBRL: 5800, stock: 15, rating: 4.8, images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80'], isVerified: true, specs: { Driver: '40mm', Bateria: '20h ANC' } },
  { id: 'p35', sellerId: 's4', sellerName: 'Cellshop', category: 'Áudio & Fones', title: 'Sennheiser Momentum True Wireless 4', description: 'Som Sennheiser premium em TWS.', priceBRL: 1100, comparePriceBRL: 1600, stock: 40, rating: 4.7, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'], isVerified: true, specs: { Driver: '7mm', Autonomia: '30h total' } },
  { id: 'p36', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Áudio & Fones', title: 'JBL PartyBox 310 — Caixa de Som 240W', description: '240W potência, luzes LED, bateria 18h.', priceBRL: 2900, comparePriceBRL: 3900, stock: 20, rating: 4.6, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'], isVerified: true, specs: { Potência: '240W', Bateria: '18h' } },
  // ── SMARTWATCH ─────────────────────────────────────────
  { id: 'p37', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Smartwatch & Wearables', title: 'Apple Watch Ultra 2 — Titanium / Alpine Loop', description: 'O smartwatch mais avançado da Apple.', priceBRL: 5200, comparePriceBRL: 7500, stock: 20, rating: 4.8, images: ['https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80'], isVerified: true, specs: { Tela: '49mm OLED', GPS: 'Dual L1/L5' } },
  { id: 'p38', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Smartwatch & Wearables', title: 'Samsung Galaxy Watch 7 — 47mm Sapphire', description: 'IA Gemini integrada e monitoramento de saúde.', priceBRL: 2100, comparePriceBRL: 2900, stock: 35, rating: 4.7, images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80'], isVerified: true, specs: { Tela: 'AMOLED 1.5"', Chip: 'Exynos W1000' } },
  { id: 'p39', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Smartwatch & Wearables', title: 'Garmin Fenix 8 Solar — Sapphire 47mm', description: 'Multi-esporte de elite com solar charging.', priceBRL: 6800, comparePriceBRL: 9000, stock: 10, rating: 4.9, images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80'], isVerified: true, specs: { GPS: 'Multi-banda L1/L5', Bateria: 'Solar 60h' } },
  { id: 'p40', sellerId: 's4', sellerName: 'Cellshop', category: 'Smartwatch & Wearables', title: 'Xiaomi Band 9 Pro — AMOLED 2"', description: `100+ modos esporte, 14 dias de bateria.`, priceBRL: 320, comparePriceBRL: 480, stock: 150, rating: 4.5, images: ['https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80'], isVerified: false, specs: { Tela: 'AMOLED 2"', Bateria: '14 dias' } },
  // ── CÂMERAS ────────────────────────────────────────────
  { id: 'p41', sellerId: 's4', sellerName: 'Cellshop', category: 'Câmeras & Foto', title: 'Sony Alpha 7 IV Full Frame Mirrorless Body', description: '33MP BSI, 4K 60p, estabilização 5 eixos.', priceBRL: 14900, comparePriceBRL: 20500, stock: 5, rating: 4.9, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'], isVerified: true, specs: { Sensor: '33MP Full-frame', Video: '4K 60p' } },
  { id: 'p42', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Câmeras & Foto', title: 'Canon EOS R6 Mark II — Body Only', description: '24.2MP, IBIS, AF de olhos para animais.', priceBRL: 12400, comparePriceBRL: 16000, stock: 7, rating: 4.8, images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80'], isVerified: true, specs: { Sensor: '24MP CMOS', Video: '4K120p RAW' } },
  { id: 'p43', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Câmeras & Foto', title: 'GoPro Hero 13 Black + Bundle', description: '5.3K, HyperSmooth 6.0, Satélite GPS.', priceBRL: 2800, comparePriceBRL: 3900, stock: 30, rating: 4.7, images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'], isVerified: true, specs: { Video: '5.3K/60fps', IP: 'IP68 10m' } },
  { id: 'p44', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Câmeras & Foto', title: 'Fujifilm X100VI — Black Limited Edition', description: '40MP BSI, IBIS e lente 23mm f/2.', priceBRL: 9800, comparePriceBRL: 13000, stock: 4, rating: 5.0, images: ['https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600&q=80'], isVerified: true, specs: { Sensor: '40MP BSI', Lente: '23mm f/2' } },
  // ── CASA & ELETRODOMÉSTICOS ────────────────────────────
  { id: 'p45', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Casa & Eletrodomésticos', title: 'LG OLED C4 65" — 4K Smart TV', description: 'OLED evo, Dolby Vision IQ, Alpha 9 Gen 7.', priceBRL: 5900, comparePriceBRL: 8200, stock: 10, rating: 4.9, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=600&q=80'], isVerified: true, specs: { Painel: 'OLED evo', Taxa: '120Hz 4K' } },
  { id: 'p46', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Casa & Eletrodomésticos', title: 'Dyson V15 Detect Total Clean', description: 'Laser detecta partículas invisíveis.', priceBRL: 4200, comparePriceBRL: 5500, stock: 15, rating: 4.8, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'], isVerified: true, specs: { Potência: '240AW', Bateria: '60min' } },
  { id: 'p47', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Casa & Eletrodomésticos', title: 'Nespresso Vertuo Next Premium', description: 'Sistema Centrifusion, cápsulas NFC.', priceBRL: 890, comparePriceBRL: 1200, stock: 40, rating: 4.8, images: ['https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&q=80'], isVerified: false, specs: { Pressão: '19 bar', Reserv: '1.1L' } },
  { id: 'p48', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Casa & Eletrodomésticos', title: 'Samsung Family Hub Geladeira 4 Portas 638L', description: 'Tela tátil 21.5", câmera interna.', priceBRL: 12800, comparePriceBRL: 17000, stock: 5, rating: 4.6, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80'], isVerified: true, specs: { Capacidade: '638L', Inverter: 'Digital' } },
  // ── PET SHOP ───────────────────────────────────────────
  { id: 'p49', sellerId: 's4', sellerName: 'Cellshop', category: 'Pet Shop', title: 'PetSafe Smart Feed — Comedouro Automático', description: 'Alimentação agendada via app.', priceBRL: 680, comparePriceBRL: 950, stock: 30, rating: 4.6, images: ['https://images.unsplash.com/photo-1601758174114-e711796d4523?w=600&q=80'], isVerified: false, specs: { Doses: '12/dia', WiFi: '2.4GHz' } },
  { id: 'p50', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Pet Shop', title: 'Furminator deShedding Tool — Cão Grande', description: 'Reduz escovação em até 90%.', priceBRL: 180, comparePriceBRL: 260, stock: 80, rating: 4.8, images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80'], isVerified: false, specs: { Porte: '> 23kg', Lâmina: 'Inox' } },
  { id: 'p51', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Pet Shop', title: 'Catit Pixi Smart Fonte para Gatos', description: 'Filtração 3 estágios, modo silencioso.', priceBRL: 250, comparePriceBRL: 380, stock: 55, rating: 4.7, images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80'], isVerified: false, specs: { Capacidade: '2.5L', Filtro: 'Triplo' } },
  { id: 'p52', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Pet Shop', title: 'GPS Tractive para Cães — Rastreador', description: 'Rastreamento ilimitado, alarme de zona.', priceBRL: 420, comparePriceBRL: 600, stock: 35, rating: 4.5, images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80'], isVerified: true, specs: { Bateria: '7 dias', IP: 'IP67' } },
  // ── INFANTIL ───────────────────────────────────────────
  { id: 'p53', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Brinquedos & Kids', title: 'LEGO Technic Bugatti Bolide 3438 Peças', description: 'Colecionável para 12+. Alta fidelidade.', priceBRL: 2200, comparePriceBRL: 3100, stock: 15, rating: 4.9, images: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80'], isVerified: true, specs: { Peças: '3438', Idade: '12+' } },
  { id: 'p54', sellerId: 's4', sellerName: 'Cellshop', category: 'Brinquedos & Kids', title: 'Hot Wheels Ultimate Garage 5 Andares', description: 'Loop, elevador e rampa de lançamento.', priceBRL: 680, comparePriceBRL: 950, stock: 30, rating: 4.7, images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80'], isVerified: false, specs: { Andares: '5', Carro: '1 incluso' } },
  { id: 'p55', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Brinquedos & Kids', title: 'Nerf Elite 2.0 Commander RD-6', description: 'Rotação manual, 6 darts, mira ajustável.', priceBRL: 120, comparePriceBRL: 180, stock: 100, rating: 4.5, images: ['https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600&q=80'], isVerified: false, specs: { Darts: '6 incluídos', Idade: '8+' } },
  { id: 'p56', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Brinquedos & Kids', title: 'PS VR2 — Horizon Call of The Mountain Bundle', description: 'VR premium com Sense Controllers.', priceBRL: 3600, comparePriceBRL: 5000, stock: 8, rating: 4.6, images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80'], isVerified: true, specs: { Res: '2000x2040/olho', FOV: '110°' } },
  // ── MODA / TÊNIS ───────────────────────────────────────
  { id: 'p57', sellerId: 's4', sellerName: 'Cellshop', category: 'Tênis Importados', title: 'Nike Air Jordan 1 Retro High OG — Chicago', description: 'O lendário Chicago. Autenticidade certificada.', priceBRL: 1890, comparePriceBRL: 2800, stock: 18, rating: 4.7, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'], isVerified: true, specs: { Tamanhos: '40-48 BR', Material: 'Couro Premium' } },
  { id: 'p58', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Tênis Importados', title: 'Adidas Yeezy Boost 350 V2 — Zebra', description: 'Boost E-TPU. 100% Original Adidas × Yeezy.', priceBRL: 2400, comparePriceBRL: 3600, stock: 8, rating: 4.8, images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'], isVerified: true, specs: { Solado: 'Boost E-TPU', Upper: 'Primeknit' } },
  { id: 'p59', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Tênis Importados', title: 'New Balance 2002R — Sea Salt', description: 'Retro running premium N-ergy cushioning.', priceBRL: 980, comparePriceBRL: 1400, stock: 22, rating: 4.6, images: ['https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80'], isVerified: true, specs: { Solado: 'N-ergy', Cabedal: 'Mesh + Couro' } },
  { id: 'p60', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Tênis Importados', title: 'On Running Cloudmonster 2 — Ice / Ivory', description: 'CloudTec Phase para corredores de elite.', priceBRL: 1250, comparePriceBRL: 1700, stock: 20, rating: 4.8, images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'], isVerified: true, specs: { Tech: 'CloudTec Phase', Drop: '6mm' } },
  // ── MODA FEMININA ─────────────────────────────────────
  { id: 'mf1', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Feminina', title: 'Vestido Midi Linho Premium — Off White', description: 'Linho italiano, corte elegante, uso dia e noite.', priceBRL: 380, comparePriceBRL: 590, stock: 45, rating: 4.8, images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'], isVerified: true, specs: { Material: 'Linho 100%', Tamanhos: 'P ao GG' } },
  { id: 'mf2', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Feminina', title: 'Blazer Oversized Alfaiataria — Camel', description: 'Trend outono 2025. Forrado, botões dourados.', priceBRL: 480, comparePriceBRL: 750, stock: 30, rating: 4.9, images: ['https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80'], isVerified: true, specs: { Corte: 'Oversized', Forro: 'Total' } },
  { id: 'mf3', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Feminina', title: 'Calça Wide Leg Seda Acetinada — Preto', description: 'Caimento perfeito, toque sedoso premium.', priceBRL: 290, comparePriceBRL: 450, stock: 55, rating: 4.7, images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'], isVerified: false, specs: { Material: 'Acetato', Cintura: 'Alta' } },
  { id: 'mf4', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Feminina', title: 'Conjunto Cropped + Saia Midi Floral', description: 'Estampa exclusiva, tecido leve para verão.', priceBRL: 220, comparePriceBRL: 340, stock: 80, rating: 4.6, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80'], isVerified: false, specs: { Estilo: 'Casual Chic', Estação: 'Verão' } },
  { id: 'mf5', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Feminina', title: 'Trench Coat London — Bege Clássico', description: 'O casaco atemporal em gabardine importada.', priceBRL: 890, comparePriceBRL: 1400, stock: 20, rating: 4.9, images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80'], isVerified: true, specs: { Tecido: 'Gabardine', Cinto: 'Incluso' } },
  { id: 'mf6', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Feminina', title: 'Saia Plissada Midi Palazzo — Terra', description: 'Tecido crepe, movimento fluido e elegante.', priceBRL: 185, comparePriceBRL: 290, stock: 65, rating: 4.5, images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80'], isVerified: false, specs: { Tecido: 'Crepe', Comprimento: 'Midi' } },
  // ── MODA MASCULINA ────────────────────────────────────
  { id: 'mm1', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Masculina', title: 'Camisa Social Slim Cotton Egípcio — Branca', description: 'Algodão egípcio 100%, passadoria fácil.', priceBRL: 280, comparePriceBRL: 420, stock: 60, rating: 4.8, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'], isVerified: true, specs: { Material: 'Algodão Egípcio', Corte: 'Slim Fit' } },
  { id: 'mm2', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Masculina', title: 'Calça Alfaiataria Jogger — Navy Blue', description: 'O equilíbrio perfeito entre formal e casual.', priceBRL: 320, comparePriceBRL: 490, stock: 40, rating: 4.7, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80'], isVerified: true, specs: { Tecido: 'Viscose + Elastano', Bolsos: '4' } },
  { id: 'mm3', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Masculina', title: 'Polo Lacoste Original L.12.12 — Verde', description: 'O clássico polo piqué autêntico Lacoste.', priceBRL: 420, comparePriceBRL: 650, stock: 35, rating: 4.9, images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80'], isVerified: true, specs: { Material: 'Piqué Cotton', Lavagem: '40°C' } },
  { id: 'mm4', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Masculina', title: 'Jaqueta Bomber Nylon Premium — Preta', description: 'Interior felpudo, corte moderno, resistente.', priceBRL: 490, comparePriceBRL: 780, stock: 25, rating: 4.6, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'], isVerified: false, specs: { Material: 'Nylon 100%', Bolsos: '3 externos' } },
  { id: 'mm5', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Masculina', title: 'Bermuda Linho Italiana — Khaki', description: 'Elegância casual para o verão. Linho puro.', priceBRL: 195, comparePriceBRL: 310, stock: 70, rating: 4.5, images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80'], isVerified: false, specs: { Material: 'Linho', Bolsos: '4' } },
  { id: 'mm6', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Masculina', title: 'Terno Slim Fit Lã Merino — Charcoal', description: 'Lã merino italiana, forro Bemberg total.', priceBRL: 1890, comparePriceBRL: 2800, stock: 12, rating: 4.9, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'], isVerified: true, specs: { Tecido: 'Lã Merino', Peças: '2 (paletó+calça)' } },
  // ── BOLSAS & ACESSÓRIOS ───────────────────────────────
  { id: 'ba1', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Bolsas & Acessórios', title: 'Bolsa Tote Couro Genuíno — Caramelo', description: 'Couro bovino curtido vegetal. A4 cabível.', priceBRL: 680, comparePriceBRL: 1050, stock: 22, rating: 4.8, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'], isVerified: true, specs: { Material: 'Couro Genuíno', Alça: 'Dupla' } },
  { id: 'ba2', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Bolsas & Acessórios', title: 'Mochila Couro Executiva Slim — Preta', description: 'Notebook 15" ajustável, USB porta externa.', priceBRL: 890, comparePriceBRL: 1400, stock: 18, rating: 4.9, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'], isVerified: true, specs: { Capacidade: '20L', USB: 'Saída externa' } },
  { id: 'ba3', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Bolsas & Acessórios', title: 'Clutch Strass Festa — Dourado', description: 'Strass cristal, corrente dourada removível.', priceBRL: 195, comparePriceBRL: 320, stock: 40, rating: 4.6, images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'], isVerified: false, specs: { Estilo: 'Festa/Noite', Corrente: 'Removível' } },
  { id: 'ba4', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Bolsas & Acessórios', title: 'Crossbody Mini Bag Nylon — Preto', description: 'Resistente a água, alça ajustável 3 bolsos.', priceBRL: 145, comparePriceBRL: 220, stock: 85, rating: 4.5, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80'], isVerified: false, specs: { Material: 'Nylon', Bolsos: '3' } },
  { id: 'ba5', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Bolsas & Acessórios', title: 'Carteira Masculina RFID Block Couro', description: 'Bloqueia RFID, 8 slots cartão, couro italiano.', priceBRL: 220, comparePriceBRL: 350, stock: 60, rating: 4.7, images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80'], isVerified: true, specs: { RFID: 'Bloqueio total', Slots: '8 cartões' } },
  { id: 'ba6', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Bolsas & Acessórios', title: 'Cinturão Couro Legítimo BOSS — Marrom', description: 'Hugo Boss original, fivela escovada.', priceBRL: 380, comparePriceBRL: 580, stock: 30, rating: 4.8, images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80'], isVerified: true, specs: { Marca: 'Hugo BOSS', Couro: 'Full Grain' } },
  // ── MALAS & VIAGEM ────────────────────────────────────
  { id: 'mv1', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Malas & Viagem', title: 'Mala Rígida Samsonite Spinner 75cm — Grafite', description: '4 rodas duplas 360°, TSA Lock, expansível.', priceBRL: 1890, comparePriceBRL: 2800, stock: 15, rating: 4.9, images: ['https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&q=80'], isVerified: true, specs: { Tamanho: '75cm grande', Rodas: '4 duplas 360°' } },
  { id: 'mv2', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Malas & Viagem', title: 'Mala Carry-On Cabine Antler — Azul Royal', description: 'Aprovada IATA. Policarbonato ultra leve.', priceBRL: 980, comparePriceBRL: 1500, stock: 25, rating: 4.8, images: ['https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80'], isVerified: true, specs: { Tamanho: '55x40x20cm', Peso: '2.2kg' } },
  { id: 'mv3', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Malas & Viagem', title: 'Mochila Viagem 40L Deuter — Verde', description: 'Trekking e viagem, costas ergonômicas.', priceBRL: 650, comparePriceBRL: 950, stock: 30, rating: 4.7, images: ['https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80'], isVerified: false, specs: { Capacidade: '40L', Costas: 'Aircontact' } },
  // ── ÓCULOS & ÓTICA ────────────────────────────────────
  { id: 'oc1', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Óculos & Ótica', title: 'Ray-Ban Aviator Large Metal — Gold/G15', description: 'O clássico aviador original. UV400.', priceBRL: 780, comparePriceBRL: 1100, stock: 35, rating: 4.9, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'], isVerified: true, specs: { UV: 'UV400', Armação: 'Metal Dourado' } },
  { id: 'oc2', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Óculos & Ótica', title: 'Tom Ford FT0858 — Black Smoke', description: 'Acetato italiano, lentes polarizadas premium.', priceBRL: 1450, comparePriceBRL: 2100, stock: 12, rating: 4.8, images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80'], isVerified: true, specs: { Material: 'Acetato Italiano', Lente: 'Polarizada' } },
  // ── MODA INFANTIL ─────────────────────────────────────
  { id: 'ki1', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Infantil', title: 'Conjunto Moletom Minnie Disney — Rosa', description: 'Oficialmente licenciado Disney. Blusão + calça quentinha.', priceBRL: 189, comparePriceBRL: 290, stock: 60, rating: 4.9, images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80'], isVerified: true, specs: { Idade: '2-12 anos', Material: 'Algodão+Poliéster' } },
  { id: 'ki2', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Infantil', title: 'Vestido Tule Festa Princesa — Branco/Dourado', description: 'Para festas e ocasiões especiais. Bordado floral.', priceBRL: 230, comparePriceBRL: 360, stock: 40, rating: 4.8, images: ['https://images.unsplash.com/photo-1543854680-38cca28c72d3?w=600&q=80'], isVerified: true, specs: { Idade: '3-10 anos', Estilo: 'Festa' } },
  { id: 'ki3', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Infantil', title: 'Nike Kids Dri-FIT Conjunto Esportivo', description: 'Tecnologia Dri-FIT absorve suor. Ideal para esporte.', priceBRL: 280, comparePriceBRL: 420, stock: 50, rating: 4.7, images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80'], isVerified: true, specs: { Idade: '4-14 anos', Tech: 'Dri-FIT' } },
  { id: 'ki4', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Infantil', title: 'Tênis Skechers Twinkle Toes com Luz', description: 'Luzes coloridas na sola. Fechamento elástico fácil.', priceBRL: 220, comparePriceBRL: 340, stock: 45, rating: 4.9, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'], isVerified: false, specs: { Tamanho: '25-35 BR', Detalhe: 'LED na sola' } },
  { id: 'ki5', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Infantil', title: 'Jaqueta Jeans Bordada Infantil — Azul', description: 'Denim macio, bordados exclusivos, forro interno.', priceBRL: 175, comparePriceBRL: 270, stock: 35, rating: 4.6, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'], isVerified: false, specs: { Idade: '2-10 anos', Material: 'Jeans Stonewash' } },
  { id: 'ki6', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Infantil', title: 'Mochila Escolar Pokemon Pikachu — 18L', description: 'Oficial Pokémon, compartimento notebook 13".', priceBRL: 145, comparePriceBRL: 220, stock: 70, rating: 4.8, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'], isVerified: false, specs: { Capacidade: '18L', Licença: 'Oficial Pokémon' } },
  // ── MODA BEBÊ ─────────────────────────────────────────
  { id: 'bb1', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Bebê', title: 'Kit Enxoval Bebê 15 Peças Premium — Neutro', description: 'Algodão 100% antialérgico. Inclui bodies, calças e babadores.', priceBRL: 320, comparePriceBRL: 499, stock: 30, rating: 5.0, images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80'], isVerified: true, specs: { Peças: '15 itens', Material: 'Algodão 100%' } },
  { id: 'bb2', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Bebê', title: 'Body Manga Longa Estampado Unissex — Pack 5', description: 'Botões pressão, estampas suaves e divertidas.', priceBRL: 120, comparePriceBRL: 185, stock: 80, rating: 4.9, images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80'], isVerified: true, specs: { Tamanho: 'RN, P, M, G, GG', Pacote: '5 unidades' } },
  { id: 'bb3', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Bebê', title: 'Sapatinho de Couro Bebê Batizado — Branco', description: 'Couro legítimo macio, ideal para batizado e festas.', priceBRL: 89, comparePriceBRL: 140, stock: 55, rating: 4.8, images: ['https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80'], isVerified: false, specs: { Tamanho: 'RN ao 3', Material: 'Couro Legítimo' } },
  { id: 'bb4', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Moda Bebê', title: 'Macacão Plush Ursinho — Antialérgico', description: 'Pelúcia plush quentinha, capuz com orelhinhas.', priceBRL: 99, comparePriceBRL: 159, stock: 65, rating: 4.9, images: ['https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80'], isVerified: false, specs: { Tamanho: 'RN ao 9 meses', Material: 'Plush Antialérgico' } },
  { id: 'bb5', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Moda Bebê', title: 'Conjunto Festa Menina Tule + Tiara — Rose Gold', description: 'Vestido + tiara floral. Para chás, mesversários e aniversários.', priceBRL: 165, comparePriceBRL: 250, stock: 40, rating: 4.8, images: ['https://images.unsplash.com/photo-1476234251651-f353703a034d?w=600&q=80'], isVerified: true, specs: { Inclui: 'Vestido + Tiara', Ocasião: 'Festa/Mesversário' } },
  { id: 'bb6', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Moda Bebê', title: 'Cobertor Swaddle Musselina Premium — Pack 3', description: 'Musselina 100% algodão orgânico certificado GOTS.', priceBRL: 140, comparePriceBRL: 210, stock: 50, rating: 5.0, images: ['https://images.unsplash.com/photo-1570296702052-4f4d3f71fef1?w=600&q=80'], isVerified: true, specs: { Material: 'Musselina Orgânica', Certif: 'GOTS' } },
  // ── ÁUDIO & SOM ─────────────────────────────────────
  { id: 'au1', sellerId: 's4', sellerName: 'Cellshop', category: 'Áudio & Fones', title: 'JBL Boombox 3 Wi-Fi — Original Black', description: 'Som massivo, Wi-Fi e Bluetooth, baterial 24h.', priceBRL: 2450, comparePriceBRL: 3200, stock: 15, rating: 4.9, images: ['https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80'], isVerified: true, specs: { Tech: 'Wi-Fi/BT', Bateria: '24h' } },
  { id: 'au2', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Áudio & Fones', title: 'Sony WH-1000XM5 Noise Cancelling', description: 'O melhor cancelamento de ruído do mercado.', priceBRL: 1890, comparePriceBRL: 2400, stock: 25, rating: 5.0, images: ['https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&q=80'], isVerified: true, specs: { ANC: 'HD QN1', Sensor: 'Presença' } },
  { id: 'au3', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Áudio & Fones', title: 'Marshall Emberton II Brass — Vintage', description: 'Design clássico Marshall com som 360.', priceBRL: 850, comparePriceBRL: 1200, stock: 40, rating: 4.8, images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80'], isVerified: false, specs: { Som: '360 Graus', IP: 'IP67' } },
  // ── SMARTWATCH ──────────────────────────────────────
  { id: 'sw1', sellerId: 's1', sellerName: 'Mega Tech CDE', category: 'Smartwatch & Wearables', title: 'Apple Watch Ultra 2 — Ocean Blue', description: 'A caixa de titânio mais robusta e capaz.', priceBRL: 4200, comparePriceBRL: 5800, stock: 12, rating: 5.0, images: ['https://images.unsplash.com/photo-1434493907317-a46b59bc043a?w=600&q=80'], isVerified: true, specs: { GPS: 'Dual freq', Brilho: '3000 nits' } },
  { id: 'sw2', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Smartwatch & Wearables', title: 'Samsung Galaxy Watch 6 Classic 47mm', description: 'O icônico aro giratório está de volta.', priceBRL: 1550, comparePriceBRL: 2200, stock: 35, rating: 4.7, images: ['https://images.unsplash.com/photo-1544117518-3063af99c35e?w=600&q=80'], isVerified: true, specs: { Tela: 'AMOLED', Sensor: 'BioActive' } },
  { id: 'sw3', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Smartwatch & Wearables', title: 'Garmin Fenix 7X Sapphire Solar Pro', description: 'Relógio multiesporte extremo com carga solar.', priceBRL: 4800, comparePriceBRL: 6500, stock: 8, rating: 4.9, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'], isVerified: true, specs: { Carga: 'Solar', Mapas: 'TopoActive' } },
  // ── CÂMERAS ─────────────────────────────────────────
  { id: 'cm1', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Câmeras & Foto', title: 'Canon EOS R5 Mirrorless — Corpo', description: 'Vídeo 8K RAW, sensor 45MP full-frame.', priceBRL: 18500, comparePriceBRL: 24000, stock: 5, rating: 5.0, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'], isVerified: true, specs: { Res: '45MP', Video: '8K' } },
  { id: 'cm2', sellerId: 's4', sellerName: 'Cellshop', category: 'Câmeras & Foto', title: 'Sony Alpha a7 IV — Kit 28-70mm', description: 'A híbrida definitiva para foto e vídeo.', priceBRL: 12400, comparePriceBRL: 16000, stock: 9, rating: 4.9, images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80'], isVerified: true, specs: { Sensor: 'Full Frame', Res: '33MP' } },
  { id: 'cm3', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Câmeras & Foto', title: 'GoPro HERO 12 Black Bundle Extra', description: 'HDR 5.3K, Max Lens Mod 2.0 compatível.', priceBRL: 1850, comparePriceBRL: 2600, stock: 50, rating: 4.8, images: ['https://images.unsplash.com/photo-1526170315870-3507b67ee4d8?w=600&q=80'], isVerified: true, specs: { Res: '5.3K', Estabil: 'HyperSmooth 6.0' } },
  // ── DRONES ──────────────────────────────────────────
  { id: 'dr1', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Drones', title: 'DJI Mini 4 Pro Fly More Combo', description: 'Menos de 249g. Detecção obstáculos 360.', priceBRL: 5800, comparePriceBRL: 7900, stock: 15, rating: 5.0, images: ['https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?w=600&q=80'], isVerified: true, specs: { Peso: '<249g', Sensor: 'CMOS 1/1.3' } },
  { id: 'dr2', sellerId: 's5', sellerName: 'DJI Store PY', category: 'Drones', title: 'DJI Air 3 — RC 2 Combo + Filtros ND', description: 'Câmeras duplas grandes. 46 min voo.', priceBRL: 8400, comparePriceBRL: 11500, stock: 7, rating: 4.9, images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80'], isVerified: true, specs: { Voo: '46 min', Câmera: 'Dual 48MP' } },
  // ── CASA INTELIGENTE ────────────────────────────────
  { id: 'cs1', sellerId: 's4', sellerName: 'Cellshop', category: 'Casa & Eletrodomésticos', title: 'Robô Aspirador Xiaomi S10+ Pro', description: 'Mapeamento Laser, limpa e passa pano.', priceBRL: 1950, comparePriceBRL: 2800, stock: 30, rating: 4.8, images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80'], isVerified: true, specs: { LiDAR: 'Navegação LDS', Poder: '4000Pa' } },
  { id: 'cs2', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Casa & Eletrodomésticos', title: 'Ar-Condicionado LG Dual Inverter 12k', description: 'IA controla temperatura, ultra silencioso.', priceBRL: 2100, comparePriceBRL: 2900, stock: 18, rating: 4.7, images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80'], isVerified: false, specs: { BTUs: '12.000', Conect: 'ThinQ Wi-Fi' } },
  // ── PET SHOP ────────────────────────────────────────
  { id: 'pt1', sellerId: 's8', sellerName: 'StyleMax Paraguay', category: 'Pet Shop', title: 'Fonte de Água Pet em Cerâmica — LED', description: 'Água sempre fresca e filtrada. Silenciosa.', priceBRL: 245, comparePriceBRL: 380, stock: 45, rating: 4.9, images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80'], isVerified: true, specs: { Vol: '2L', Material: 'Cerâmica' } },
  { id: 'pt2', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Pet Shop', title: 'Cama Pet Nuvem Ortopédica — G Luxo', description: 'Reduz ansiedade, espuma memória.', priceBRL: 185, comparePriceBRL: 290, stock: 60, rating: 4.8, images: ['https://images.unsplash.com/photo-1591768793355-74d7af236c17?w=600&q=80'], isVerified: false, specs: { Tam: '80cm G', Cor: 'Cinza Mescla' } },
  // ── BRINQUEDOS & KIDS ──────────────────────────────
  { id: 'ty1', sellerId: 's7', sellerName: 'Luxy Moda CDE', category: 'Brinquedos & Kids', title: 'LEGO Icons — Porsche 911 2-em-1', description: '1458 peças. Construa Turbo ou Targa.', priceBRL: 890, comparePriceBRL: 1350, stock: 10, rating: 5.0, images: ['https://images.unsplash.com/photo-1587654711723-bc351acbc824?w=600&q=80'], isVerified: true, specs: { Peças: '1458', Idade: '18+' } },
  { id: 'ty2', sellerId: 's6', sellerName: 'Fashion Store PY', category: 'Brinquedos & Kids', title: 'Patete Elétrico Xiaomi M365 Kids', description: 'Velocidade limitada 15km/h. Seguro e leve.', priceBRL: 1450, comparePriceBRL: 2100, stock: 15, rating: 4.7, images: ['https://images.unsplash.com/photo-1560064060-1f0124ecd93d?w=600&q=80'], isVerified: true, specs: { Vmax: '15km/h', Alcance: '12km' } },
  // ── PERFUMES PREMIUM (EXTRA) ────────────────────────
  { id: 'pf3', sellerId: 's4', sellerName: 'Cellshop', category: 'Perfumes Premium', title: 'Sauvage Dior Elixir — 60ml', description: 'O ápice da intensidade de Sauvage.', priceBRL: 980, comparePriceBRL: 1350, stock: 25, rating: 5.0, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80'], isVerified: true, specs: { Vol: '60ml', Tipo: 'Parfum' } },
  { id: 'pf4', sellerId: 's3', sellerName: 'Casa Nissei', category: 'Perfumes Premium', title: 'Baccarat Rouge 540 — Kurkdjian', description: 'Perfume de nicho. O cheiro da riqueza.', priceBRL: 2850, comparePriceBRL: 3900, stock: 6, rating: 5.0, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80'], isVerified: true, specs: { Vol: '70ml', Nicho: 'Sim' } },
  // ── RELÓGIOS LUXO (EXTRA) ───────────────────────────
  { id: 're3', sellerId: 's2', sellerName: 'Sony Center PY', category: 'Relógios de Luxo', title: 'Omega Speedmaster Moonwatch', description: 'O primeiro relógio usado na Lua.', priceBRL: 32000, comparePriceBRL: 42000, stock: 3, rating: 5.0, images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80'], isVerified: true, specs: { Maq: 'Calibre 3861', Aço: '316L' } },
];




export const WHOLESALE_VOLUME_TIERS = [
  { label: '5 a 9 unidades', discount: 10, badge: 'Starter', color: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  { label: '10 a 19 unidades', discount: 18, badge: 'Pro', color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' },
  { label: '20 a 49 unidades', discount: 25, badge: 'Master', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  { label: '50+ unidades', discount: 32, badge: 'Elite', color: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
];

export const WHOLESALE_TOP_CATEGORIES = [
  { name: 'Celulares', icon: '📱', avgOrder: '12 un', saving: '22%', trend: '+34%' },
  { name: 'Perfumes Premium', icon: '🧴', avgOrder: '24 un', saving: '28%', trend: '+18%' },
  { name: 'Fones & Áudio', icon: '🎧', avgOrder: '30 un', saving: '25%', trend: '+41%' },
  { name: 'Relógios', icon: '⌚', avgOrder: '8 un', saving: '20%', trend: '+12%' },
  { name: 'Games', icon: '🎮', avgOrder: '15 un', saving: '18%', trend: '+27%' },
  { name: 'Tênis Importados', icon: '👟', avgOrder: '20 un', saving: '30%', trend: '+55%' },
];

export const WHOLESALE_STATS = [
  { label: 'Revendedores Ativos', value: '2.840', icon: '🏪', change: '+18%' },
  { label: 'GMV Atacado/mês', value: 'R$ 8,4M', icon: '💰', change: '+31%' },
  { label: 'Desconto Médio', value: '23%', icon: '🏷️', change: '+3pp' },
  { label: 'Entrega Média', value: '4,2 dias', icon: '🚚', change: '-0,8d' },
];

export interface CategoryMeta {
  label: string;
  gradient: string;          // Tailwind gradient classes for hero
  iconPath: React.ReactNode;
  subCategories: {
    label: string;
    icon: React.ReactNode;
    id: string;
    img?: string;
    children?: { id: string; label: string }[];
  }[];
  brands: { name: string; logo: React.ReactNode }[];
  productFilter: string;     // matches Product.category substring
  premiumHero?: {
    main: string;
    left: { title: string; img: string; font?: string }[];
    right: { title: string; img: string; font?: string }[];
  };
}

export const CATEGORY_MAP: Record<string, CategoryMeta> = {
  'mais-vendidos': {
    label: 'Mais Vendidos', gradient: 'from-amber-500 to-orange-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    subCategories: [
      { id: 'c1', label: 'Celulares', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
      { id: 'c2', label: 'Games', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4m-2-2v4" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="11.5" r=".5" fill="currentColor" /></svg> },
      { id: 'c3', label: 'Apple', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
      { id: 'c4', label: 'Fones', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg> },
    ],
    brands: [],
    productFilter: '',
  },
  'ofertas': {
    label: 'Ofertas do Dia', gradient: 'from-rose-500 to-red-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    subCategories: [
      { id: 'o1', label: 'Flash Sale', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
      { id: 'o2', label: 'Liquidação', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg> },
      { id: 'o3', label: 'Frete Grátis', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> },
    ],
    brands: [],
    productFilter: '',
  },
  'celulares': {
    label: 'Celulares & Tablets', gradient: 'from-indigo-600 to-blue-700',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
    subCategories: [
      { id: 'iphone', label: 'iPhone', img: 'https://images.unsplash.com/photo-1696446702183-f3ec08b7df5d?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 20.94c1.88-1.58 3-4.13 3-6.94 0-4.42-3-8-3-8s-3 3.58-3 8c0 2.81 1.12 5.36 3 6.94z" /></svg>, children: [{ id: 'ip15', label: 'iPhone 15 Series' }, { id: 'ip14', label: 'iPhone 14 Series' }, { id: 'ip13', label: 'iPhone 13 Series' }] },
      { id: 'samsung', label: 'Samsung', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="2" /></svg>, children: [{ id: 's24', label: 'Galaxy S24 Series' }, { id: 's23', label: 'Galaxy S23 Series' }, { id: 'zfold', label: 'Galaxy Z Fold/Flip' }] },
      { id: 'xiaomi', label: 'Xiaomi', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, children: [{ id: 'mi14', label: 'Xiaomi 14 Series' }, { id: 'poco', label: 'Linha POCO' }, { id: 'redmi', label: 'Redmi Note' }] },
      { id: 'motorola', label: 'Motorola', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 8a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3z" /><path d="M13 22V11" /></svg>, children: [{ id: 'edge', label: 'Linha Edge' }, { id: 'motog', label: 'Moto G Series' }] },
      { id: 'tablet', label: 'Tablets', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="4" y="2" width="16" height="20" rx="2" /></svg>, children: [{ id: 'ipadmini', label: 'iPad Mini' }, { id: 'ipadpro', label: 'iPad Pro' }, { id: 'galtab', label: 'Galaxy Tab S' }] },
    ],
    brands: [
      { name: 'Apple', logo: '' }, { name: 'Samsung', logo: 'S' },
      { name: 'Xiaomi', logo: 'Mi' }, { name: 'Motorola', logo: 'M' },
    ],
    productFilter: 'Celulares',
    premiumHero: {
      main: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
      left: [
        { title: 'IA Generativa', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', font: 'font-serif italic' },
        { title: 'Zoom 100x', img: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500&q=80', font: 'font-black' },
        { title: 'Titanium Build', img: 'https://images.unsplash.com/photo-1696446702183-f3ec08b7df5d?w=500&q=80', font: 'font-extrabold uppercase' },
      ],
      right: [
        { title: 'Gaming Pro', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80', font: 'font-serif italic' },
        { title: 'Carga 120W', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', font: 'font-black' },
        { title: 'Leica Optics', img: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80', font: 'font-extrabold uppercase' },
      ]
    }
  },
  'apple': {
    label: 'Produtos Apple', gradient: 'from-slate-700 to-black',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    subCategories: [
      { id: 'iphone', label: 'iPhone', img: 'https://images.unsplash.com/photo-1695048132625-0a6df571e74d?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="2" /></svg>, children: [{ id: 'ip15', label: 'iPhone 15 Series' }, { id: 'ip14', label: 'iPhone 14 Series' }] },
      { id: 'mac', label: 'MacBook', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /><path d="M1 16h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></svg>, children: [{ id: 'air', label: 'MacBook Air' }, { id: 'pro', label: 'MacBook Pro' }] },
      { id: 'ipad', label: 'iPad', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="4" y="2" width="16" height="20" rx="2" /></svg>, children: [{ id: 'ipadmini', label: 'iPad Mini' }, { id: 'ipadpro', label: 'iPad Pro' }, { id: 'ipadair', label: 'iPad Air' }] },
      { id: 'watch', label: 'Watch', img: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="7" /><path d="M12 9v3l1.5 1.5" /><path d="M16 17.5l-0.3 3.5a2 2 0 0 1-2 1.5H10.3a2 2 0 0 1-2-1.5l-0.3-3.5" /><path d="M16 6.5l-0.3-3.5a2 2 0 0 0-2-1.5H10.3a2 2 0 0 0-2 1.5l-0.3 3.5" /></svg>, children: [{ id: 'awse', label: 'Watch SE' }, { id: 'aw9', label: 'Watch Series 9' }, { id: 'awultra', label: 'Watch Ultra' }] },
      { id: 'airpods', label: 'AirPods', img: 'https://images.unsplash.com/photo-1588423771073-b8903fead714?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /></svg>, children: [{ id: 'ap3', label: 'AirPods 3' }, { id: 'appro', label: 'AirPods Pro' }, { id: 'apmax', label: 'AirPods Max' }] },
    ],
    brands: [{ name: 'Apple', logo: '' }],
    productFilter: 'Apple',
    premiumHero: {
      main: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&q=80',
      left: [
        { title: 'Think Different', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', font: 'font-serif italic' },
        { title: 'Pro. Beyond.', img: 'https://images.unsplash.com/photo-1695048132625-0a6df571e74d?w=500&q=80', font: 'font-black' },
        { title: 'M4 Power', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', font: 'font-extrabold uppercase' },
      ],
      right: [
        { title: 'Titanium Build', img: 'https://images.unsplash.com/photo-1696446702183-f3ec08b7df5d?w=500&q=80', font: 'font-serif italic' },
        { title: 'Ultra 2 Vision', img: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&q=80', font: 'font-black' },
        { title: 'Sonic Mastery', img: 'https://images.unsplash.com/photo-1588423771073-b8903fead714?w=500&q=80', font: 'font-extrabold uppercase' },
      ]
    }
  },
  'games': {
    label: 'Games & Consoles', gradient: 'from-violet-700 to-indigo-900',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4m-2-2v4" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="11.5" r=".5" fill="currentColor" /></svg>,
    subCategories: [
      { id: 'ps5', label: 'PlayStation 5', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="6" width="20" height="12" rx="2" /></svg> },
      { id: 'xbox', label: 'Xbox Series', img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="6" width="20" height="12" rx="2" /></svg> },
      { id: 'nintendo', label: 'Switch', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="4" width="14" height="16" rx="2" /></svg> },
      { id: 'setup', label: 'Setup Gamer', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /><path d="M1 16h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></svg> },
    ],
    brands: [
      { name: 'Sony', logo: 'S' }, { name: 'Microsoft', logo: 'M' },
      { name: 'Nintendo', logo: 'N' }, { name: 'Razer', logo: 'R' },
    ],
    productFilter: 'Games',
    premiumHero: {
      main: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&q=80',
      left: [
        { title: 'New Worlds', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80', font: 'font-serif italic' },
        { title: 'Power Your Dreams', img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80', font: 'font-black' },
        { title: 'Level Up', img: 'https://images.unsplash.com/photo-1542751128-151783839ef6?w=500&q=80', font: 'font-extrabold uppercase' },
      ],
      right: [
        { title: 'Play Has No Limits', img: 'https://images.unsplash.com/photo-1592840448138-e5ff03b597fd?w=500&q=80', font: 'font-serif italic' },
        { title: 'Portable Fun', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80', font: 'font-black' },
        { title: 'Meta Verse', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&q=80', font: 'font-extrabold uppercase' },
      ]
    }
  },
  'notebook': {
    label: 'Notebooks', gradient: 'from-cyan-500 to-blue-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /><path d="M1 16h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></svg>,
    subCategories: [
      { id: 'mac', label: 'MacBook', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /></svg> },
      { id: 'gamer', label: 'Gamer', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
      { id: 'work', label: 'Office', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2" /></svg> },
      { id: 'acc', label: 'Acessórios', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><rect x="9" y="4" width="6" height="16" rx="3" /></svg> },
    ],
    brands: [
      { name: 'Apple', logo: '' }, { name: 'Dell', logo: 'D' },
      { name: 'Lenovo', logo: 'L' }, { name: 'ASUS', logo: 'A' },
    ],
    productFilter: 'Notebook',
  },
  'perfumes': {
    label: 'Perfumes Premium', gradient: 'from-pink-500 to-rose-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5.95C17.4 11.35 17 14 17 14a5 5 0 0 1-10 0s-.4-2.65 1-5.05L9 3z" /></svg>,
    subCategories: [
      { id: 'fem', label: 'Feminino', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 12V21M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-3 6h6" /></svg> },
      { id: 'masc', label: 'Masculino', img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12l3 3m0 0l-3 3m3-3H13m0 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" /></svg> },
      { id: 'rare', label: 'Nicho', img: 'https://images.unsplash.com/photo-1588514912908-9ea8a81e9e86?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg> },
      { id: 'set', label: 'Kits Luxury', img: 'https://images.unsplash.com/photo-1557431177-36141475c676?w=200&h=200&fit=crop&q=80', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M12 8V4m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4" /></svg> },
    ],
    brands: [
      { name: 'Chanel', logo: 'C' }, { name: 'Dior', logo: 'D' },
      { name: 'YSL', logo: 'Y' }, { name: 'Tom Ford', logo: 'TF' },
    ],
    productFilter: 'Perfumes',
    premiumHero: {
      main: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&q=80',
      left: [
        { title: 'Essência Real', img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80', font: 'font-serif italic' },
        { title: 'Ouro Olfativo', img: 'https://images.unsplash.com/photo-1607852088855-eeadd7c99b81?w=500&q=80', font: 'font-black' },
        { title: 'Batch 2024', img: 'https://images.unsplash.com/photo-1588514912908-9ea8a81e9e86?w=500&q=80', font: 'font-extrabold uppercase' },
      ],
      right: [
        { title: 'Noite de Gala', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80', font: 'font-serif italic' },
        { title: 'Colecionadores', img: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&q=80', font: 'font-black' },
        { title: 'Exclusividade', img: 'https://images.unsplash.com/photo-1620893043274-05eb0ce8e65e?w=500&q=80', font: 'font-extrabold uppercase' },
      ]
    }
  },
  'relogios': {
    label: 'Relógios de Luxo', gradient: 'from-amber-400 to-yellow-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    subCategories: [
      { id: 'rolex', label: 'Rolex', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg> },
      { id: 'omega', label: 'Omega', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg> },
      { id: 'tag', label: 'TAG Heuer', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg> },
      { id: 'invicta', label: 'Invicta', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg> },
    ],
    brands: [
      { name: 'Rolex', logo: 'R' }, { name: 'Omega', logo: 'O' },
      { name: 'TAG Heuer', logo: 'T' }, { name: 'Casio', logo: 'C' },
    ],
    productFilter: 'Relógios',
  },
  'drones': {
    label: 'Drones & Action', gradient: 'from-cyan-400 to-teal-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 17.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.5 17.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /></svg>,
    subCategories: [
      { id: 'dji', label: 'DJI Consumer', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="2" /></svg> },
      { id: 'fpv', label: 'FPV Racing', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg> },
      { id: 'pro', label: 'Enterprise', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
      { id: 'acc', label: 'Baterias', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg> },
    ],
    brands: [{ name: 'DJI', logo: 'D' }, { name: 'Autel', logo: 'A' }],
    productFilter: 'Drones',
  },
  'audio': {
    label: 'Áudio & Som', gradient: 'from-purple-500 to-indigo-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>,
    subCategories: [
      { id: 'head', label: 'Headphones', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" /></svg> },
      { id: 'ear', label: 'In-ear', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" /></svg> },
      { id: 'box', label: 'Caixas Bluetooth', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg> },
      { id: 'pro', label: 'Home Theater', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg> },
    ],
    brands: [
      { name: 'JBL', logo: 'J' }, { name: 'Sony', logo: 'S' },
      { name: 'Bose', logo: 'B' }, { name: 'Marshall', logo: 'M' },
    ],
    productFilter: 'Áudio',
  },
  'smartwatch': {
    label: 'Smartwatch', gradient: 'from-green-500 to-teal-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="7" /><polyline points="12 9 12 12 13.5 13.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 17.5l-.35 3.82A2 2 0 0 1 14.17 23H9.83a2 2 0 0 1-2-1.82L7.5 17.5M7.5 6.5l.34-3.82A2 2 0 0 1 9.83 1h4.34a2 2 0 0 1 2 1.68l.33 3.82" /></svg>,
    subCategories: [
      { id: 'apple', label: 'Apple Watch', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="7" /></svg> },
      { id: 'galaxy', label: 'Samsung', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="7" /></svg> },
      { id: 'garmin', label: 'Garmin/Esporte', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="7" /></svg> },
      { id: 'band', label: 'Smartbands', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="7" /></svg> },
    ],
    brands: [
      { name: 'Apple', logo: '' }, { name: 'Samsung', logo: 'S' },
      { name: 'Garmin', logo: 'G' }, { name: 'Amazfit', logo: 'A' },
    ],
    productFilter: 'Smartwatch',
  },
  'cameras': {
    label: 'Câmeras & Foto', gradient: 'from-yellow-400 to-amber-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
    subCategories: [
      { id: 'mirror', label: 'Mirrorless', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /></svg> },
      { id: 'lens', label: 'Lentes', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="6" /></svg> },
      { id: 'action', label: 'Action Cam', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="5" width="20" height="14" rx="2" /></svg> },
      { id: 'inst', label: 'Instantâneas', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg> },
    ],
    brands: [
      { name: 'Canon', logo: 'C' }, { name: 'Sony', logo: 'S' },
      { name: 'Nikon', logo: 'N' }, { name: 'GoPro', logo: 'G' },
    ],
    productFilter: 'Câmeras',
  },
  'casa': {
    label: 'Casa Inteligente', gradient: 'from-green-500 to-emerald-700',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    subCategories: [
      { id: 'eletro', label: 'Eletro', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg> },
      { id: 'kitchen', label: 'Cozinha', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" /></svg> },
      { id: 'smart', label: 'Smart Home', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.674a1 1 0 00.908-.588l.617-1.44a4.002 4.002 0 00-7.724 0l.617 1.44a1 1 0 00.908.588zM12 2v2m0 16v2m8-10h2M2 12h2m13.657-5.657l1.414-1.414m-12.02 12.02l1.414-1.414M4.343 4.343l1.414 1.414m12.02 12.02l1.414 1.414" /></svg> },
      { id: 'care', label: 'Cuidados', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
    ],
    brands: [
      { name: 'Philips', logo: 'P' }, { name: 'Braun', logo: 'B' },
      { name: 'Electrolux', logo: 'E' }, { name: 'Xiaomi', logo: 'X' },
    ],
    productFilter: 'Casa',
  },
  'moda': {
    label: 'Moda & Estilo', gradient: 'from-fuchsia-500 to-pink-700',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></svg>,
    subCategories: [
      { id: 'fem', label: 'Moda Feminina', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, children: [{ id: 'dresses', label: 'Vestidos' }, { id: 'blazers', label: 'Blazers & Alfaiataria' }, { id: 'skirts', label: 'Saias & Conjuntos' }] },
      { id: 'masc', label: 'Moda Masculina', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0" /></svg>, children: [{ id: 'shirts', label: 'Camisas Sociais' }, { id: 'pants', label: 'Calças & Bermudas' }, { id: 'suits', label: 'Ternos & Jaquetas' }] },
      { id: 'shoes', label: 'Tênis Importados', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></svg>, children: [{ id: 'nike', label: 'Nike & Jordan' }, { id: 'adidas', label: 'Adidas & Yeezy' }, { id: 'casual', label: 'Casual & Running' }] },
      { id: 'bags', label: 'Bolsas & Malas', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="8" width="18" height="12" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4" /></svg>, children: [{ id: 'backpacks', label: 'Mochilas' }, { id: 'luggage', label: 'Malas de Viagem' }, { id: 'wallets', label: 'Carteiras & Acessórios' }] },
    ],
    brands: [
      { name: 'Nike', logo: 'N' }, { name: 'Adidas', logo: 'A' },
      { name: 'Zara', logo: 'Z' }, { name: 'Lacoste', logo: 'L' },
    ],
    productFilter: 'Moda',
  },
  'pet': {
    label: 'Pet & Nature', gradient: 'from-lime-500 to-green-600',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="4" r="2" /><circle cx="18" cy="9" r="2" /><circle cx="4" cy="9" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c0-4-5-7.5-5-7.5S4 10 6 8.5c1.5-1 4.5 0 6 1.5 1.5-1.5 4.5-2.5 6-1.5 2 1.5-3 6-3 6s-3 3.5-3 7z" /></svg>,
    subCategories: [
      { id: 'dog', label: 'Cães', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /></svg> },
      { id: 'cat', label: 'Gatos', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /></svg> },
      { id: 'fish', label: 'Aquário', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /></svg> },
      { id: 'gear', label: 'Acessórios', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /></svg> },
    ],
    brands: [
      { name: 'Royal Canin', logo: 'R' }, { name: 'Hills', logo: 'H' },
      { name: 'Furminator', logo: 'F' }, { name: 'PetSafe', logo: 'P' },
    ],
    productFilter: 'Pet',
  },
  'infantil': {
    label: 'Brinquedos & Kids', gradient: 'from-pink-400 to-yellow-400',
    iconPath: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>,
    subCategories: [
      { id: 'toy', label: 'Brinquedos', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="5" /></svg> },
      { id: 'game', label: 'Tabuleiro', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="5" /></svg> },
      { id: 'edu', label: 'Educativo', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="5" /></svg> },
      { id: 'ride', label: 'Veículos', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="5" /></svg> },
    ],
    brands: [
      { name: 'LEGO', logo: 'L' }, { name: 'Hasbro', logo: 'H' },
      { name: 'Mattel', logo: 'M' }, { name: 'Fisher-Price', logo: 'F' },
    ],
    productFilter: 'Brinquedos',
  },
};

export const INVESTOR_METRICS = [
  { name: 'GMV Mensal', value: 2400000, change: 22, prefix: 'R$ ' },
  { name: 'Sellers Ativos', value: 124, change: 12 },
  { name: 'CAC Blended', value: 42, change: -7, prefix: 'R$ ' },
  { name: 'LTV:CAC', value: 5.2, change: 8, suffix: ':1' },
];
