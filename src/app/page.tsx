'use client';

import { useState, useEffect, useRef } from 'react';
import { InventoryItem, Transaction } from '@/types';
import { PlusCircle, History, Package, Clock, Trash2 } from 'lucide-react';

const LAST_SELECTED_ITEM_ID_KEY = 'stock:lastSelectedItemId';
type InitialCatalogItem = Omit<InventoryItem, 'quantity' | 'lastUpdated'> & {
  openingBalance?: number;
};

const INITIAL_INVENTORY_ITEMS: InitialCatalogItem[] = [
  { id: 'CG001', itemCode: 'CG001', name: 'Hairnet (防尘帽)', cost: 0, features: '', supplier: '' },
  { id: 'CG002', itemCode: 'CG002', name: 'Disposable mask (一次性口罩)', cost: 0, features: '', supplier: '' },
  { id: 'CG003', itemCode: 'CG003', name: 'Glove (一次性手套)', cost: 0, features: '', supplier: '' },
  { id: 'CG004', itemCode: 'CG004', name: 'Transparent mask (透明口罩)', cost: 0, features: '', supplier: '' },
  { id: 'CG005', itemCode: 'CG005', name: 'Punch card (考勤卡)', cost: 0, features: '', supplier: '' },
  { id: 'CG006', itemCode: 'CG006', name: 'Toothpick (牙签)', cost: 0, features: '', supplier: '' },
  { id: 'CG007', itemCode: 'CG007', name: 'Printer paper roll (80*60) (后厨打印机纸)', cost: 0, features: '80*60', supplier: '' },
  { id: 'CG008', itemCode: 'CG008', name: 'POS card machine paper roll (刷卡机打印纸)', cost: 0, features: '', supplier: '' },
  { id: 'CG009', itemCode: 'CG009', name: 'Napkins (餐巾纸)', cost: 0, features: '', supplier: '' },

  { id: 'DB001', itemCode: 'DB001', name: 'Mineral water (矿泉水)', cost: 0, features: '', supplier: '' },
  { id: 'DB002', itemCode: 'DB002', name: '100+ (100+)', cost: 0, features: '', supplier: '' },
  { id: 'DB003', itemCode: 'DB003', name: 'Coca-cola (可乐)', cost: 0, features: '', supplier: '' },
  { id: 'DB004', itemCode: 'DB004', name: 'Ba bao cha (八宝茶)', cost: 0, features: '', supplier: '' },
  { id: 'DB005', itemCode: 'DB005', name: 'Condensed milk (炼乳)', cost: 0, features: '', supplier: '' },

  { id: 'GB001', itemCode: 'GB001', name: 'Garbage bag(36*48) (垃圾袋 36*48)', cost: 0, features: '36*48', supplier: '' },
  { id: 'GB002', itemCode: 'GB002', name: 'Garbage bag (45*50) (垃圾袋 45*50)', cost: 0, features: '45*50', supplier: '' },
  { id: 'GB003', itemCode: 'GB003', name: 'Garbage bag (90*120) (垃圾袋 90*120)', cost: 0, features: '90*120', supplier: '' },
  { id: 'GB004', itemCode: 'GB004', name: 'Rubbish bin (240L) (垃圾桶 240L)', cost: 0, features: '240L', supplier: '' },

  { id: 'HS001', itemCode: 'HS001', name: 'Floor cleaner (地板清洁液)', cost: 0, features: '', supplier: '' },
  { id: 'HS002', itemCode: 'HS002', name: 'Table cleaner (桌椅清洁液)', cost: 0, features: '', supplier: '' },
  { id: 'HS003', itemCode: 'HS003', name: 'Dish wash liquid (洗碗液)', cost: 0, features: '', supplier: '' },

  { id: 'PB001', itemCode: 'PB001', name: 'Plastic bag (9x12) (塑料袋)', cost: 0, features: '9*12', supplier: '' },
  { id: 'PB002', itemCode: 'PB002', name: 'Plastic bag (17x20) (塑料袋)', cost: 0, features: '17*20', supplier: '' },
  { id: 'PB003', itemCode: 'PB003', name: 'Plastic bag (24x28) (塑料袋)', cost: 0, features: '24*28', supplier: '' },
  { id: 'PB004', itemCode: 'PB004', name: 'Plastic bag (20*32) (塑料袋)', cost: 0, features: '20*32', supplier: '' },
  { id: 'PB005', itemCode: 'PB005', name: 'Plastic bag (26*42) (塑料袋)', cost: 0, features: '26*42', supplier: '' },
  { id: 'PB006', itemCode: 'PB006', name: 'Tea bag (10*30) (饮料打包袋)', cost: 0, features: '10*30', supplier: '' },
  { id: 'PB007', itemCode: 'PB007', name: 'Beef patty paper bag (16*10.50) (牛肉饼纸袋)', cost: 0, features: '16*10.50', supplier: '' },

  { id: 'RG001', itemCode: 'RG001', name: 'Ramen Bowl - 19*9cm (拉面大碗)', cost: 0, features: '陶瓷，口径19cm，高9cm，带标，36个/件', supplier: '' },
  { id: 'RG002', itemCode: 'RG002', name: 'Small Ramen Bowl- 12*9cm (拉面小碗)', cost: 0, features: '陶瓷，口径12cm，高9cm，带标，36个/件', supplier: '' },
  { id: 'RG003', itemCode: 'RG003', name: 'Fry noodle plate- 250*25 (炒面盘)', cost: 0, features: '钢化密胺，双色收口，250*25', supplier: '' },
  { id: 'RG004', itemCode: 'RG004', name: 'Beef Small Plate - 150mm (小牛肉盘)', cost: 0, features: '钢化密胺，直径150mm，带LOGO', supplier: '' },
  { id: 'RG005', itemCode: 'RG005', name: 'Long-Handled Soup Ladle (长柄汤勺 - 20cm)', cost: 0, features: '20cm', supplier: '' },
  { id: 'RG006', itemCode: 'RG006', name: 'Long-Handled Bamboo Ladle (长柄竹勺 - 21cm)', cost: 0, features: '21cm', supplier: '' },
  { id: 'RG007', itemCode: 'RG007', name: 'Blue and White Porcelain Bowl (青花瓷碗（含底座）-35cm)', cost: 0, features: '（装辣椒油/蒜苗/肉丁）直径35cm', supplier: '' },
  { id: 'RG008', itemCode: 'RG008', name: 'Stainless steel chili oil spoon (不锈钢辣椒油勺)', cost: 0, features: '调辣椒油、凉面调料等', supplier: '' },
  { id: 'RG009', itemCode: 'RG009', name: 'Chili/Vinegar cruet (辣椒油醋壶)', cost: 0, features: '醋，辣椒，底板，三件套', supplier: '' },
  { id: 'RG010', itemCode: 'RG010', name: 'Stainless steel soup container(3.5L) (不锈钢汤罐)', cost: 0, features: '不锈钢，带把，容量3.5升', supplier: '' },
  { id: 'RG011', itemCode: 'RG011', name: 'Chef Uniform (厨师制服)', cost: 0, features: '上衣，围裙，帽子，绣标绣字', supplier: '' },
  { id: 'RG012', itemCode: 'RG012', name: 'T-shirt Uniform (Short Sleeves) (服务员制服T恤)', cost: 0, features: '黑色T恤+棒球帽', supplier: '' },
  { id: 'RG013', itemCode: 'RG013', name: 'Promotional Video USB Drive (宣传片U盘)', cost: 0, features: '店内播放宣传片', supplier: '' },
  { id: 'RG014', itemCode: 'RG014', name: 'Plaque (Etched Plaque) (奖牌（腐蚀牌）)', cost: 0, features: '奖牌', supplier: '' },
  { id: 'RG015', itemCode: 'RG015', name: 'Chopstick Sterilizer - 240mm (筷子消毒机)', cost: 0, features: '240mm', supplier: '' },
  { id: 'RG016', itemCode: 'RG016', name: 'Chopsticks - 240mm (筷子)', cost: 0, features: '240mm', supplier: '' },
  { id: 'RG017', itemCode: 'RG017', name: 'Knife and Fork (刀叉)', cost: 0, features: '', supplier: '' },
  { id: 'RG018', itemCode: 'RG018', name: 'Potato grater (土豆擦丝器)', cost: 0, features: '', supplier: '' },
  { id: 'RG019', itemCode: 'RG019', name: 'Strainer (漏勺)', cost: 0, features: '', supplier: '' },
  { id: 'RG020', itemCode: 'RG020', name: 'Fine-Mesh Strainer - middle size (密漏)', cost: 0, features: '', supplier: '' },
  { id: 'RG021', itemCode: 'RG021', name: 'Stove Filter - big (灶滤)', cost: 0, features: '', supplier: '' },
  { id: 'RG022', itemCode: 'RG022', name: 'Kitchen Knife (菜刀)', cost: 0, features: '', supplier: '' },
  { id: 'RG023', itemCode: 'RG023', name: 'Cleaver (剁刀)', cost: 0, features: '', supplier: '' },
  { id: 'RG024', itemCode: 'RG024', name: 'Scissors (剪刀)', cost: 0, features: '', supplier: '' },
  { id: 'RG025', itemCode: 'RG025', name: 'Oil canister (油罐子)', cost: 0, features: '', supplier: '' },
  { id: 'RG026', itemCode: 'RG026', name: 'Stainless Steel bucket (70cm) (不锈钢桶)', cost: 0, features: '70cm', supplier: '' },
  { id: 'RG027', itemCode: 'RG027', name: 'Stainless Steel bucket (60cm) (不锈钢桶)', cost: 0, features: '60cm', supplier: '' },
  { id: 'RG028', itemCode: 'RG028', name: 'Stainless Steel bucket (40cm) (不锈钢桶)', cost: 0, features: '40cm', supplier: '' },
  { id: 'RG029', itemCode: 'RG029', name: 'Stainless Steel bucket (30L) (不锈钢桶)', cost: 0, features: '30L', supplier: '' },
  { id: 'RG030', itemCode: 'RG030', name: 'Stainless steel basin- 50cm (不锈钢盆)', cost: 0, features: '50cm', supplier: '' },
  { id: 'RG031', itemCode: 'RG031', name: 'Storage Container - 44*33*21 (周转箱)', cost: 0, features: '44*33*21', supplier: '' },
  { id: 'RG032', itemCode: 'RG032', name: 'Long Chopsticks (长筷子)', cost: 0, features: '', supplier: '' },
  { id: 'RG033', itemCode: 'RG033', name: 'Soup ladle (舀汤勺)', cost: 0, features: '', supplier: '' },
  { id: 'RG034', itemCode: 'RG034', name: 'Stainless Steel Tray - 60*40 (不锈钢盘)', cost: 0, features: '60*40', supplier: '' },
  { id: 'RG035', itemCode: 'RG035', name: 'Electronic Scale - 33*32 (电子称)', cost: 0, features: '33*32', supplier: '' },
  { id: 'RG036', itemCode: 'RG036', name: 'Seasoning pack - 20*25 (调料包)', cost: 0, features: '20*25', supplier: '' },
  { id: 'RG037', itemCode: 'RG037', name: 'Tray- 35.5*25.5 (托盘)', cost: 0, features: '35.5*25.5', supplier: '' },
  { id: 'RG038', itemCode: 'RG038', name: 'Plastic wrap- 25*650 (保鲜膜)', cost: 0, features: '25*650', supplier: '' },
  { id: 'RG039', itemCode: 'RG039', name: 'Dough Scraper- 18.8*14 (刮板)', cost: 0, features: '18.8*14', supplier: '' },
  { id: 'RG040', itemCode: 'RG040', name: 'Ramen powder dilution bottle- 650ml (拉面剂稀释瓶)', cost: 0, features: '650ml', supplier: '' },
  { id: 'RG041', itemCode: 'RG041', name: 'Order bell (出菜铃)', cost: 0, features: '', supplier: '' },
  { id: 'RG042', itemCode: 'RG042', name: 'Place card holder (席位卡夹)', cost: 0, features: '', supplier: '' },
  { id: 'RG043', itemCode: 'RG043', name: 'Hook (挂钩)', cost: 0, features: '', supplier: '' },
  { id: 'RG044', itemCode: 'RG044', name: 'Chopstick Holder (筷子笼)', cost: 0, features: '', supplier: '' },
  { id: 'RG045', itemCode: 'RG045', name: 'Tissue Box (纸巾盒)', cost: 0, features: '', supplier: '' },
  { id: 'RG046', itemCode: 'RG046', name: "Children's Chair (儿童椅)", cost: 0, features: '', supplier: '' },
  { id: 'RG047', itemCode: 'RG047', name: 'Takeout Order Clamp - 50cm (外卖夹单器)', cost: 0, features: '50cm', supplier: '' },
  { id: 'RG048', itemCode: 'RG048', name: 'Skewers (烧烤签)', cost: 0, features: '', supplier: '' },
  { id: 'RG049', itemCode: 'RG049', name: 'Floor Brush - 24*89 (地刷)', cost: 0, features: '24*89', supplier: '' },
  { id: 'RG050', itemCode: 'RG050', name: 'Duster cloth (抹布)', cost: 0, features: '', supplier: '' },
  { id: 'RG051', itemCode: 'RG051', name: 'Pan brush (锅刷)', cost: 0, features: '', supplier: '' },
  { id: 'RG052', itemCode: 'RG052', name: 'Meat hook (肉勾子)', cost: 0, features: '', supplier: '' },
  { id: 'RG053', itemCode: 'RG053', name: 'Movable stainless steel pallet (100*60*10) (不锈钢托盘（带轮子）)', cost: 0, features: '100*60*10', supplier: '' },
  { id: 'RG054', itemCode: 'RG054', name: 'Flavor bag (18*18) (卤味笼)', cost: 0, features: '18*18', supplier: '' },
  { id: 'RG055', itemCode: 'RG055', name: 'Apron (围裙)', cost: 0, features: '', supplier: '' },

  { id: 'SS001', itemCode: 'SS001', name: 'JWD soup powder (出口调汤料)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS002', itemCode: 'SS002', name: 'JWD meat stew powder (出口煮肉料)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS003', itemCode: 'SS003', name: 'JWD chilli powder (出口辣椒粉)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS004', itemCode: 'SS004', name: 'JWD BBQ chili powder (出口烧烤辣椒面)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS005', itemCode: 'SS005', name: 'JWD noodle fry/sauerkraut powder (炒面料/酸菜料)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS006', itemCode: 'SS006', name: 'JWD meat grill powder (烤肉料)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS007', itemCode: 'SS007', name: 'JWD beef seasoning powder (牛肉馅料)', cost: 0, features: '', supplier: '金味德' },
  { id: 'SS008', itemCode: 'SS008', name: 'JWD noodle pulling powder (出口拉面剂)', cost: 0, features: '', supplier: '金味德' },

  { id: 'TA001', itemCode: 'TA001', name: 'Aluminum Foil Takeout Thermal Handbag (铝箔外卖保温手提袋+B20)', cost: 0, features: '24*15*24', supplier: '' },
  { id: 'TA002', itemCode: 'TA002', name: 'Soup bag - 500ml (汤袋)', cost: 0, features: '500mL', supplier: '' },
  { id: 'TA003', itemCode: 'TA003', name: 'Disposable chopstick (一次性筷子)', cost: 0, features: '', supplier: '' },
  { id: 'TA004', itemCode: 'TA004', name: 'Disposable spoon (一次性勺子)', cost: 0, features: '', supplier: '' },
  { id: 'TA005', itemCode: 'TA005', name: 'Disposable fork (一次性叉子)', cost: 0, features: '', supplier: '' },
  { id: 'TA006', itemCode: 'TA006', name: 'Straw (吸管)', cost: 0, features: '', supplier: '' },
  { id: 'TA007', itemCode: 'TA007', name: 'Lid (盖子)', cost: 0, features: '', supplier: '' },
  { id: 'TA008', itemCode: 'TA008', name: 'Take-away cup \"cold\" - 500ml (打包冷饮杯)', cost: 0, features: '500ml', supplier: '' },
  { id: 'TA009', itemCode: 'TA009', name: 'Take away cup \"hot\" - 400ml (打包热饮杯)', cost: 0, features: '400ml', supplier: '' },
  { id: 'TA010', itemCode: 'TA010', name: 'Take-away round container 320ml (外卖餐盒（锁扣，防滑盒身）)', cost: 0, features: '320ml，带LOGO', supplier: '' },
  { id: 'TA011', itemCode: 'TA011', name: 'Take-away round container - 1280ml (外卖餐盒（锁扣）)', cost: 0, features: '1280mL，带LOGO', supplier: '' },
  { id: 'TA012', itemCode: 'TA012', name: 'Chili oil sauce cup - 35ml (辣椒油酱料杯)', cost: 0, features: '35ml', supplier: '' },
  { id: 'TA013', itemCode: 'TA013', name: 'Take-away round box - 1000ml (普通打包圆盒)', cost: 0, features: '1000ml', supplier: '' },
  { id: 'TA014', itemCode: 'TA014', name: 'Take-away rectangle box - 1000 (普通打包方盒)', cost: 0, features: '', supplier: '' },

  { id: 'FA001', itemCode: 'FA001', name: 'Kitchen printer USB+Lan (后厨打印机)', cost: 0, features: 'USB+Lan', supplier: '' },
  { id: 'FA002', itemCode: 'FA002', name: 'Fry Pan/Wok (炒锅)', cost: 0, features: '', supplier: '' },
  { id: 'FA003', itemCode: 'FA003', name: 'Induction cooker (电磁炉)', cost: 0, features: '4500w', supplier: '' },
  { id: 'FA004', itemCode: 'FA004', name: 'Air purifier (空气净化机)', cost: 0, features: '', supplier: '' },
  { id: 'FA005', itemCode: 'FA005', name: 'Meat grinder (绞肉机)', cost: 0, features: '6000w', supplier: '' },
  { id: 'FA006', itemCode: 'FA006', name: 'Electric ceramic stove (电陶炉)', cost: 0, features: '', supplier: '' },
  { id: 'FA007', itemCode: 'FA007', name: 'Dough sheeter machine (压面机)', cost: 0, features: '380V | 1500w', supplier: '' },
  { id: 'FA008', itemCode: 'FA008', name: 'Commercial Dough Mixer (和面机)', cost: 0, features: '380V | 1500w', supplier: '' },
  { id: 'FA009', itemCode: 'FA009', name: 'Refrigerated Flat Cabinet (平冷柜)', cost: 0, features: '220V | 1320w', supplier: '' },
  { id: 'FA010', itemCode: 'FA010', name: 'Commercial freezer (四门冷柜)', cost: 0, features: '280w', supplier: '' },
  { id: 'FA011', itemCode: 'FA011', name: 'Commercial Electric Griddle (电饼铛)', cost: 0, features: '5500w', supplier: '' },
  { id: 'FA012', itemCode: 'FA012', name: 'Electric grill for BBQ (电烤炉)', cost: 0, features: '4800w', supplier: '' },
  { id: 'FA013', itemCode: 'FA013', name: 'Ultrasound washing machine (超声波洗碗机)', cost: 0, features: '1800w', supplier: '' },
  { id: 'FA014', itemCode: 'FA014', name: 'Slicing machine (切肉机)', cost: 0, features: '550w', supplier: '' },
  { id: 'FA015', itemCode: 'FA015', name: 'Electric fry stove (电炒炉)', cost: 0, features: '1500w', supplier: '' },
  { id: 'FA016', itemCode: 'FA016', name: 'Electric Soup boiler (矮汤炉)', cost: 0, features: '8000w', supplier: '' },
  { id: 'FA017', itemCode: 'FA017', name: 'Electric Soup stove (商用汤锅)', cost: 0, features: '1500w', supplier: '' },
  { id: 'FA018', itemCode: 'FA018', name: 'Commercial Food Warmer (保脆展示柜)', cost: 0, features: '600w', supplier: '' },
  { id: 'FA019', itemCode: 'FA019', name: 'Chest freezer (冰柜)', cost: 0, features: '300w', supplier: '' },
  { id: 'FA020', itemCode: 'FA020', name: 'Chiller (保鲜柜)', cost: 0, features: '500w', supplier: '' },
  { id: 'FA021', itemCode: 'FA021', name: 'Coway water dispenser (饮水机)', cost: 0, features: '600w', supplier: '' },
];

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [editingSupplierItemId, setEditingSupplierItemId] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState('');
  const skipNextBlurRef = useRef(false);
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemFeatures, setNewItemFeatures] = useState('');
  const [newItemSupplier, setNewItemSupplier] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const isCreatingNewItem = selectedItemId === '__new__';

  // Load data from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    const savedTransactions = localStorage.getItem('transactions');
    if (savedInventory) {
      const parsed: InventoryItem[] = JSON.parse(savedInventory);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const lastSelectedItemId = localStorage.getItem(LAST_SELECTED_ITEM_ID_KEY) ?? '';
        const normalized = parsed.map((item) => ({
          ...item,
          itemCode: item.itemCode ?? '',
          cost: item.cost ?? 0,
          features: item.features ?? '',
          supplier: item.supplier ?? '',
        }));
        setInventory(normalized);
        if (lastSelectedItemId && normalized.some((i) => i.id === lastSelectedItemId)) {
          setSelectedItemId(lastSelectedItemId);
        }
      } else {
        const now = Date.now();
        const initialInventory: InventoryItem[] = INITIAL_INVENTORY_ITEMS.map((item) => ({
          ...item,
          quantity: item.openingBalance ?? 0,
          lastUpdated: now,
        }));
        setInventory(initialInventory);
      }
    } else {
      const now = Date.now();
      const initialInventory: InventoryItem[] = INITIAL_INVENTORY_ITEMS.map((item) => ({
        ...item,
        quantity: item.openingBalance ?? 0,
        lastUpdated: now,
      }));
      setInventory(initialInventory);
    }
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('inventory', JSON.stringify(inventory));
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [inventory, transactions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!selectedItemId) return;
    if (selectedItemId === '__new__') return;
    localStorage.setItem(LAST_SELECTED_ITEM_ID_KEY, selectedItemId);
  }, [selectedItemId, isLoaded]);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !newItemQuantity) return;

    const quantity = parseInt(newItemQuantity);
    if (isNaN(quantity) || quantity <= 0) return;

    const timestamp = Date.now();
    const transactionId = Math.random().toString(36).substring(2, 9);

    let nextInventory = inventory;
    let itemNameForTransaction = '';
    let createdItemId: string | null = null;

    if (isCreatingNewItem) {
      const trimmedCode = newItemCode.trim();
      const trimmedName = newItemName.trim();
      const trimmedFeatures = newItemFeatures.trim();
      const trimmedSupplier = newItemSupplier.trim();
      const cost = Number(newItemCost);

      if (!trimmedCode || !trimmedName || !trimmedFeatures || !trimmedSupplier) return;
      if (!Number.isFinite(cost) || cost < 0) return;
      if (inventory.some((i) => i.name === trimmedName)) return;
      if (inventory.some((i) => i.itemCode === trimmedCode)) return;

      const newItemId = Math.random().toString(36).substring(2, 9);
      const newItem: InventoryItem = {
        id: newItemId,
        itemCode: trimmedCode,
        name: trimmedName,
        cost,
        features: trimmedFeatures,
        supplier: trimmedSupplier,
        quantity,
        lastUpdated: timestamp,
      };

      nextInventory = [...inventory, newItem];
      itemNameForTransaction = newItem.name;
      createdItemId = newItemId;
    } else {
      const existingItemIndex = inventory.findIndex((item) => item.id === selectedItemId);
      if (existingItemIndex === -1) return;

      const target = inventory[existingItemIndex];
      itemNameForTransaction = target.name;

      nextInventory = inventory.map((item) => {
        if (item.id !== selectedItemId) return item;
        return {
          ...item,
          quantity: item.quantity + quantity,
          lastUpdated: timestamp,
        };
      });
    }

    setInventory(nextInventory);
    setTransactions([
      {
        id: transactionId,
        itemName: itemNameForTransaction,
        quantity,
        timestamp,
        type: 'IN',
      },
      ...transactions,
    ]);

    if (createdItemId) {
      setSelectedItemId(createdItemId);
    }

    setNewItemCode('');
    setNewItemName('');
    setNewItemCost('');
    setNewItemFeatures('');
    setNewItemSupplier('');
    setNewItemQuantity('');
  };

  const clearData = () => {
    if (confirm('确定要清除所有数据吗？')) {
      setInventory([]);
      setTransactions([]);
      localStorage.removeItem('inventory');
      localStorage.removeItem('transactions');
    }
  };

  const startEditQuantity = (item: InventoryItem) => {
    setEditingSupplierItemId(null);
    setEditingSupplier('');
    setEditingItemId(item.id);
    setEditingQuantity(String(item.quantity));
  };

  const cancelEditQuantity = () => {
    skipNextBlurRef.current = true;
    setEditingItemId(null);
    setEditingQuantity('');
  };

  const saveEditQuantity = (item: InventoryItem) => {
    const next = parseInt(editingQuantity, 10);
    if (!Number.isFinite(next) || next < 0) {
      cancelEditQuantity();
      return;
    }

    const timestamp = Date.now();
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        return {
          ...i,
          quantity: next,
          lastUpdated: timestamp,
        };
      })
    );
    cancelEditQuantity();
  };

  const startEditSupplier = (item: InventoryItem) => {
    setEditingItemId(null);
    setEditingQuantity('');
    setEditingSupplierItemId(item.id);
    setEditingSupplier(item.supplier ?? '');
  };

  const cancelEditSupplier = () => {
    skipNextBlurRef.current = true;
    setEditingSupplierItemId(null);
    setEditingSupplier('');
  };

  const saveEditSupplier = (item: InventoryItem) => {
    const next = editingSupplier.trim();
    const timestamp = Date.now();
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        return {
          ...i,
          supplier: next,
          lastUpdated: timestamp,
        };
      })
    );
    cancelEditSupplier();
  };

  const overwriteInventoryFromCatalog = () => {
    if (!confirm('确定要用清单覆盖当前库存吗？这不会清除入库记录。')) return;
    const now = Date.now();
    const initialInventory: InventoryItem[] = INITIAL_INVENTORY_ITEMS.map((item) => ({
      ...item,
      quantity: item.openingBalance ?? 0,
      lastUpdated: now,
    }));
    setInventory(initialInventory);
    setSelectedItemId('');
    localStorage.removeItem(LAST_SELECTED_ITEM_ID_KEY);
  };

  if (!isLoaded) return <div className="p-8 text-center">加载中...</div>;

  const searchTokens = inventorySearch
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const filteredInventory =
    searchTokens.length === 0
      ? inventory
      : inventory.filter((item) => {
          const haystack = `${item.itemCode} ${item.name} ${item.features} ${item.supplier}`.toLowerCase();
          return searchTokens.every((token) => haystack.includes(token));
        });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 md:p-8 font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">存货管理系统</h1>
            <p className="text-gray-500 dark:text-gray-400">实时跟踪您的物品入库与库存状态</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={overwriteInventoryFromCatalog}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 dark:text-blue-300 dark:border-blue-900/30 dark:hover:bg-blue-900/20 transition-colors"
            >
              用清单覆盖库存
            </button>
            <button
              onClick={clearData}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} />
              清除所有数据
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <section className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="text-blue-500" size={20} />
                物品入库
              </h2>
              <form onSubmit={handleAddStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">物品名称</label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  >
                    <option value="" disabled>
                      请选择物品
                    </option>
                    {inventory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.itemCode ? `${item.itemCode} - ${item.name}` : item.name}
                      </option>
                    ))}
                    <option value="__new__">➕ 新增物品…</option>
                  </select>
                </div>

                {isCreatingNewItem && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">物品编号</label>
                      <input
                        type="text"
                        value={newItemCode}
                        onChange={(e) => setNewItemCode(e.target.value)}
                        placeholder="例如: SKU-001"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">新物品名称</label>
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="例如: 苹果, 笔记本"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">成本</label>
                      <input
                        type="number"
                        value={newItemCost}
                        onChange={(e) => setNewItemCost(e.target.value)}
                        placeholder="例如: 12.5"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">特征</label>
                      <input
                        type="text"
                        value={newItemFeatures}
                        onChange={(e) => setNewItemFeatures(e.target.value)}
                        placeholder="例如: 红色 / 500g / 有机"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">供货商</label>
                      <input
                        type="text"
                        value={newItemSupplier}
                        onChange={(e) => setNewItemSupplier(e.target.value)}
                        placeholder="例如: XX供应商"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">入库数量</label>
                  <input
                    type="number"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="输入正整数"
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md shadow-blue-500/20"
                >
                  确认入库
                </button>
              </form>
            </div>

            {/* Stats Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">概览</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{inventory.length}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">物品种类</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {inventory.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">总库存量</p>
                </div>
              </div>
            </div>
          </section>

          {/* Display Section */}
          <section className="lg:col-span-2 space-y-8">
            {/* Inventory List */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="text-green-500" size={20} />
                  当前存货清单
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-fixed">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 text-xs">
                    <tr>
                      <th colSpan={6} className="px-4 py-3 font-medium">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <input
                            type="text"
                            value={inventorySearch}
                            onChange={(e) => setInventorySearch(e.target.value)}
                            placeholder="关键字搜索：名称 / 编号 / 特征 / 供货商"
                            className="w-full sm:w-80 max-w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          />
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {filteredInventory.length}/{inventory.length}
                          </div>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      <th className="px-4 py-3 font-medium w-[26%]">物品名称</th>
                      <th className="px-4 py-3 font-medium w-[10%]">物品编号</th>
                      <th className="px-4 py-3 font-medium w-[8%]">成本</th>
                      <th className="px-4 py-3 font-medium w-[28%]">特征</th>
                      <th className="px-4 py-3 font-medium w-[14%]">当前数量</th>
                      <th className="px-4 py-3 font-medium w-[14%]">供货商</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {inventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">暂无库存数据</td>
                      </tr>
                    ) : filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">没有匹配结果</td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => (
                        <tr
                          key={item.id}
                          className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 dark:odd:bg-zinc-900 dark:even:bg-zinc-900/70 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-sm">
                            <span title={item.name} className="block whitespace-normal break-words leading-5">
                              {item.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {item.itemCode || '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {Number.isFinite(item.cost) ? item.cost.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                            <span title={item.features || ''} className="block whitespace-normal break-words leading-5">
                              {item.features || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {editingItemId === item.id ? (
                              <input
                                autoFocus
                                type="number"
                                min="0"
                                step="1"
                                value={editingQuantity}
                                onChange={(e) => setEditingQuantity(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditQuantity(item);
                                  if (e.key === 'Escape') cancelEditQuantity();
                                }}
                                onBlur={() => {
                                  if (skipNextBlurRef.current) {
                                    skipNextBlurRef.current = false;
                                    return;
                                  }
                                  saveEditQuantity(item);
                                }}
                                className="w-28 px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                              />
                            ) : (
                              <div
                                onDoubleClick={() => startEditQuantity(item)}
                                className="inline-flex items-center gap-2 cursor-text select-none"
                                title="双击修改数量"
                              >
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm font-bold">
                                  {item.quantity}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                            {editingSupplierItemId === item.id ? (
                              <input
                                autoFocus
                                type="text"
                                value={editingSupplier}
                                onChange={(e) => setEditingSupplier(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditSupplier(item);
                                  if (e.key === 'Escape') cancelEditSupplier();
                                }}
                                onBlur={() => {
                                  if (skipNextBlurRef.current) {
                                    skipNextBlurRef.current = false;
                                    return;
                                  }
                                  saveEditSupplier(item);
                                }}
                                className="w-full min-w-0 px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                              />
                            ) : (
                              <div
                                onDoubleClick={() => startEditSupplier(item)}
                                className="flex items-start gap-2 cursor-text select-none"
                                title="双击修改供货商"
                              >
                                <span title={item.supplier || ''} className="block whitespace-normal break-words leading-5 flex-1 min-w-0">
                                  {item.supplier || '-'}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="text-purple-500" size={20} />
                  入库记录 (时间顺序)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">时间</th>
                      <th className="px-6 py-3 font-medium">物品</th>
                      <th className="px-6 py-3 font-medium">操作</th>
                      <th className="px-6 py-3 font-medium text-right">数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">暂无入库记录</td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 text-sm flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            {new Date(t.timestamp).toLocaleString('zh-CN')}
                          </td>
                          <td className="px-6 py-4 font-medium">{t.itemName}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded uppercase">
                              入库
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-blue-600 dark:text-blue-400">
                            +{t.quantity}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
