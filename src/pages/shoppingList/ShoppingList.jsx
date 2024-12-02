import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Plus, Minus, ShoppingCart, FileText, Trash2, Check } from 'lucide-react';
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { Input } from "../../components/ui/input";
import { useUser } from '../../UserContext';
import axios from 'axios';

const ShoppingList = () => {
    const { user } = useUser();
    
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [showAddItem, setShowAddItem] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAllSelected, setIsAllSelected] = useState(false);

    // Fetch shopping list when the component mounts
    useEffect(() => {
        const fetchShoppingList = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3100/api/shoppingList/${user.userId}`);
                setItems(response.data.items);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch shopping list');
                setLoading(false);
            }
        };
        
        fetchShoppingList();
    }, [user]);

    const handleAddItem = async () => {
        if (newItem.trim()) {
            try {
                const response = await axios.post('http://localhost:3100/api/shoppingList/add', {
                    userId: user.userId,
                    selectedIngredients: [{
                        name: newItem,
                        quantity: 1,
                        ingredientId: Date.now() 
                    }]
                });

                setItems([...items, response.data.addedIngredients[0]]);
                setNewItem('');
                setShowAddItem(false);
            } catch (err) {
                console.error('Error adding item:', err);
            }
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            const updatedItems = items.filter(item => item.ingredientId !== id);
            setItems(updatedItems);

            await axios.delete('http://localhost:3100/api/shoppingList/remove', {
                data: {
                    userId: user.userId,
                    ingredientId: id
                }
            });
        } catch (err) {
            console.error('Error removing item:', err);
            setItems(items);
        }
    };

    const handleQuantityChange = async (id, change) => {
        const updatedItems = items.map(item => {
            if (item.ingredientId === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setItems(updatedItems);

        try {
            await axios.put('http://localhost:3100/api/shoppingList/update', {
                userId: user.userId,
                ingredientId: id,
                quantity: updatedItems.find(item => item.ingredientId === id).quantity
            });
        } catch (err) {
            console.error('Error updating quantity:', err);
            setItems(items);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedIngredients(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // New function to handle select all
    const handleSelectAll = () => {
        if (isAllSelected) {
            // If all are currently selected, deselect all
            setSelectedIngredients({});
            setIsAllSelected(false);
        } else {
            // Select all items
            const allSelected = items.reduce((acc, item) => {
                acc[item.ingredientId] = true;
                return acc;
            }, {});
            setSelectedIngredients(allSelected);
            setIsAllSelected(true);
        }
    };

    // New function to delete selected ingredients
    const handleDeleteSelected = async () => {
        const selectedIds = Object.keys(selectedIngredients)
            .filter(id => selectedIngredients[id])
            .map(Number);

        if (selectedIds.length === 0) {
            alert('No items selected');
            return;
        }

        try {
            // Remove selected items from UI first
            const updatedItems = items.filter(
                item => !selectedIds.includes(item.ingredientId)
            );
            setItems(updatedItems);

            // Batch delete from backend
            await Promise.all(selectedIds.map(id => 
                axios.delete('http://localhost:3100/api/shoppingList/remove', {
                    data: {
                        userId: user.userId,
                        ingredientId: id
                    }
                })
            ));

            // Clear selection
            setSelectedIngredients({});
            setIsAllSelected(false);
        } catch (err) {
            console.error('Error deleting selected items:', err);
            // Revert UI if deletion fails
            setItems(items);
        }
    };

    const handleAddToShoppingList = async () => {
        if (!user) {
            alert('Please log in first');
            return;
        }
        try {
            const selectedItems = items.filter(item => selectedIngredients[item.ingredientId]);
            
            await axios.post("http://localhost:3100/api/shoppingList/add", {
                userId: user.userId,
                selectedIngredients: selectedItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    ingredientId: item.ingredientId,
                })),
            });
            alert("Ingredients added to shopping list!");
        } catch (error) {
            console.error("Error adding ingredients:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Shopping List</h1>
                    <div className="flex gap-2">
                        {/* Select All Button */}
                        <Button 
                            variant="outline" 
                            onClick={handleSelectAll}
                            className="flex items-center gap-2"
                        >
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                            <Check className="w-4 h-4" />
                        </Button>

                        {/* Delete Selected Button */}
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                        >
                            Delete Selected
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Items</h2>
                    {showAddItem ? (
                        <div className="flex gap-2 mb-4">
                            <Input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="Enter item name"
                                className="flex-grow"
                            />
                            <Button onClick={handleAddItem}>Add</Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setShowAddItem(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </Button>
                    )}
                </div>

                <div className="space-y-4 mb-20">
                    {items.map((item) => (
                        <div
                            key={item.ingredientId}
                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={!!selectedIngredients[item.ingredientId]} 
                                    onChange={() => handleCheckboxChange(item.ingredientId)}
                                />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.ingredientId, -1)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.ingredientId, 1)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {/* Replace Remove Item button with Delete Icon */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.ingredientId)}
                                    className="text-red-500 hover:text-red-700 hover:bg-transparent p-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleAddToShoppingList}
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="ml-2">Add Selected to Shopping List</span>
                </Button>
            </main>

            <Footer />
        </div>
    );
};

export default ShoppingList;