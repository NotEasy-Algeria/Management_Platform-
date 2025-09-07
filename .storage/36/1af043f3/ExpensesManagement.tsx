import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, Search, Edit, Trash2, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface Expense {
  id: string;
  description: string;
  category: 'salaries' | 'supplies' | 'utilities' | 'maintenance' | 'food' | 'insurance' | 'other';
  amount: number;
  date: string;
  vendor: string;
  receiptNumber?: string;
  status: 'pending' | 'approved' | 'paid';
  paymentMethod?: string;
}

const ExpensesManagement = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Salaire Amina Bensaid - Janvier 2024',
      category: 'salaries',
      amount: 45000,
      date: '2024-01-31',
      vendor: 'Amina Bensaid',
      status: 'paid',
      paymentMethod: 'Virement bancaire'
    },
    {
      id: '2',
      description: 'Fournitures scolaires - Papier, crayons, peinture',
      category: 'supplies',
      amount: 8500,
      date: '2024-01-15',
      vendor: 'Papeterie El Bahdja',
      receiptNumber: 'FAC-2024-001',
      status: 'paid',
      paymentMethod: 'Espèces'
    },
    {
      id: '3',
      description: 'Facture électricité - Janvier 2024',
      category: 'utilities',
      amount: 12000,
      date: '2024-01-20',
      vendor: 'Sonelgaz',
      receiptNumber: 'ELEC-2024-01',
      status: 'pending'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    description: '',
    category: 'supplies' as Expense['category'],
    amount: 0,
    date: '',
    vendor: '',
    receiptNumber: '',
    status: 'pending' as Expense['status'],
    paymentMethod: ''
  });

  const categories = [
    { value: 'salaries', label: 'Salaires', color: 'bg-blue-100 text-blue-800' },
    { value: 'supplies', label: 'Fournitures', color: 'bg-green-100 text-green-800' },
    { value: 'utilities', label: 'Services publics', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-purple-100 text-purple-800' },
    { value: 'food', label: 'Alimentation', color: 'bg-orange-100 text-orange-800' },
    { value: 'insurance', label: 'Assurance', color: 'bg-red-100 text-red-800' },
    { value: 'other', label: 'Autre', color: 'bg-gray-100 text-gray-800' }
  ];

  const resetForm = () => {
    setFormData({
      description: '',
      category: 'supplies',
      amount: 0,
      date: '',
      vendor: '',
      receiptNumber: '',
      status: 'pending',
      paymentMethod: ''
    });
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      vendor: expense.vendor,
      receiptNumber: expense.receiptNumber || '',
      status: expense.status,
      paymentMethod: expense.paymentMethod || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const expenseData: Expense = {
        id: editingExpense?.id || Date.now().toString(),
        ...formData
      };

      if (editingExpense) {
        setExpenses(prev => prev.map(expense => expense.id === editingExpense.id ? expenseData : expense));
        toast.success('Dépense modifiée avec succès !');
      } else {
        setExpenses(prev => [...prev, expenseData]);
        toast.success('Dépense ajoutée avec succès !');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteExpenseId) return;
    
    try {
      setExpenses(prev => prev.filter(expense => expense.id !== deleteExpenseId));
      toast.success('Dépense supprimée avec succès !');
      setDeleteExpenseId(null);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return <Badge className={cat?.color}>{cat?.label}</Badge>;
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || expense.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((acc, expense) => acc + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des dépenses</h1>
            <p className="text-gray-600">Suivez et gérez les dépenses de la crèche</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle dépense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? 'Modifier la dépense' : 'Ajouter une dépense'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez la dépense..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value: Expense['category']) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Montant (DA) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendor">Fournisseur *</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor}
                      onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Nom du fournisseur"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiptNumber">N° Facture/Reçu</Label>
                    <Input
                      id="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                      placeholder="FAC-2024-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Mode de paiement</Label>
                    <Select 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                        <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                        <SelectItem value="Chèque">Chèque</SelectItem>
                        <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: Expense['status']) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-red-500 hover:bg-red-600 flex-1"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : (editingExpense ? 'Modifier' : 'Ajouter')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">{totalExpenses.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">Total dépenses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{paidExpenses.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">Payé</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">{pendingExpenses.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{expenses.length}</div>
              <div className="text-sm text-gray-600">Nombre de dépenses</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par description ou fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-left p-4 font-medium">Catégorie</th>
                    <th className="text-left p-4 font-medium">Montant</th>
                    <th className="text-left p-4 font-medium">Fournisseur</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          {expense.receiptNumber && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Receipt className="w-3 h-3 mr-1" />
                              {expense.receiptNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">{getCategoryBadge(expense.category)}</td>
                      <td className="p-4 font-medium">{expense.amount.toLocaleString()} DA</td>
                      <td className="p-4">{expense.vendor}</td>
                      <td className="p-4">{new Date(expense.date).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">{getStatusBadge(expense.status)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteExpenseId(expense.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' ? 'Aucune dépense trouvée' : 'Aucune dépense enregistrée'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'Essayez de modifier vos filtres' 
                    : 'Commencez par ajouter la première dépense'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteExpenseId}
        onOpenChange={(open) => !open && setDeleteExpenseId(null)}
        title="Supprimer la dépense"
        description="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action ne peut pas être annulée."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default ExpensesManagement;