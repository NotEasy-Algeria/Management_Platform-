import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Plus, Search, Edit, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { usePayments, useChildren } from '@/hooks/useApi';
import { Payment } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { toast } from 'sonner';

const PaymentsManagement = () => {
  const { payments, loading, error, createPayment, updatePayment } = usePayments();
  const { children } = useChildren();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    childId: '',
    amount: 0,
    dueDate: '',
    paidDate: '',
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    invoiceNumber: ''
  });

  const resetForm = () => {
    setFormData({
      childId: '',
      amount: 0,
      dueDate: '',
      paidDate: '',
      status: 'pending',
      invoiceNumber: ''
    });
    setEditingPayment(null);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      childId: payment.childId,
      amount: payment.amount,
      dueDate: payment.dueDate,
      paidDate: payment.paidDate || '',
      status: payment.status,
      invoiceNumber: payment.invoiceNumber
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const child = children.find(c => c.id === formData.childId);
      const childName = child ? `${child.firstName} ${child.lastName}` : 'Enfant non trouvé';
      const parentName = child ? child.parentName : 'Parent non trouvé';
      
      const paymentData = {
        ...formData,
        childName,
        parentName,
        invoiceNumber: formData.invoiceNumber || `INV-${Date.now()}`
      };

      if (editingPayment) {
        await updatePayment(editingPayment.id, paymentData);
        toast.success('Paiement modifié avec succès !');
      } else {
        await createPayment(paymentData);
        toast.success('Paiement ajouté avec succès !');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsPaid = async (payment: Payment) => {
    try {
      await updatePayment(payment.id, { 
        ...payment, 
        status: 'paid', 
        paidDate: new Date().toISOString().split('T')[0] 
      });
      toast.success('Paiement marqué comme payé !');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((acc, payment) => acc + payment.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((acc, payment) => acc + payment.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((acc, payment) => acc + payment.amount, 0);

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
            <p className="text-gray-600">Suivez les paiements et facturations</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPayment ? 'Modifier le paiement' : 'Ajouter un paiement'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="childId">Enfant *</Label>
                  <Select 
                    value={formData.childId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, childId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un enfant" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.filter(c => c.status === 'active').map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.firstName} {child.lastName} - {child.parentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <Label htmlFor="invoiceNumber">N° Facture</Label>
                    <Input
                      id="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Date d'échéance *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="paidDate">Date de paiement</Label>
                    <Input
                      id="paidDate"
                      type="date"
                      value={formData.paidDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, paidDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'paid' | 'pending' | 'overdue') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-green-500 hover:bg-green-600 flex-1"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      editingPayment ? 'Modifier' : 'Ajouter'
                    )}
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

        {error && (
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{totalAmount.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">Total facturé</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{paidAmount.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">Montant payé</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">{pendingAmount.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">{overdueAmount.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">En retard</div>
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
                  placeholder="Rechercher par enfant, parent ou facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Facture</th>
                    <th className="text-left p-4 font-medium">Enfant</th>
                    <th className="text-left p-4 font-medium">Parent</th>
                    <th className="text-left p-4 font-medium">Montant</th>
                    <th className="text-left p-4 font-medium">Échéance</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{payment.invoiceNumber}</td>
                      <td className="p-4">{payment.childName}</td>
                      <td className="p-4">{payment.parentName}</td>
                      <td className="p-4 font-medium">{payment.amount.toLocaleString()} DA</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(payment.status)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(payment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {payment.status !== 'paid' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => markAsPaid(payment)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Aucun paiement trouvé' : 'Aucun paiement enregistré'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Essayez de modifier vos filtres' 
                    : 'Commencez par ajouter le premier paiement'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PaymentsManagement;