'use client';

import { useState, useEffect } from 'react';
import { InventoryItem, Transaction } from '@/types';
import { PlusCircle, History, Package, Clock, Trash2 } from 'lucide-react';

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    const savedTransactions = localStorage.getItem('transactions');
    if (savedInventory) setInventory(JSON.parse(savedInventory));
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

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemQuantity) return;

    const quantity = parseInt(newItemQuantity);
    if (isNaN(quantity) || quantity <= 0) return;

    const timestamp = Date.now();
    const transactionId = Math.random().toString(36).substring(2, 9);

    // Create transaction
    const newTransaction: Transaction = {
      id: transactionId,
      itemName: newItemName,
      quantity: quantity,
      timestamp: timestamp,
      type: 'IN',
    };

    // Update transactions (newest first)
    setTransactions([newTransaction, ...transactions]);

    // Update inventory
    setInventory(prevInventory => {
      const existingItemIndex = prevInventory.findIndex(item => item.name === newItemName);
      if (existingItemIndex > -1) {
        const updatedInventory = [...prevInventory];
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity: updatedInventory[existingItemIndex].quantity + quantity,
          lastUpdated: timestamp,
        };
        return updatedInventory;
      } else {
        const newItem: InventoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          name: newItemName,
          quantity: quantity,
          lastUpdated: timestamp,
        };
        return [...prevInventory, newItem];
      }
    });

    // Reset form
    setNewItemName('');
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

  if (!isLoaded) return <div className="p-8 text-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 md:p-8 font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">存货管理系统</h1>
            <p className="text-gray-500 dark:text-gray-400">实时跟踪您的物品入库与库存状态</p>
          </div>
          <button 
            onClick={clearData}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={16} />
            清除所有数据
          </button>
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
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">物品名称</th>
                      <th className="px-6 py-3 font-medium">当前数量</th>
                      <th className="px-6 py-3 font-medium text-right">最后更新</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {inventory.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-gray-400">暂无库存数据</td>
                      </tr>
                    ) : (
                      inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 font-medium">{item.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm font-bold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500">
                            {new Date(item.lastUpdated).toLocaleString('zh-CN')}
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
