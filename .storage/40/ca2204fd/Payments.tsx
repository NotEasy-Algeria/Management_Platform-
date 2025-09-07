import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ParentLayout from '@/components/ParentLayout';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Receipt
} from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - would come from API in production
  const paymentHistory = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      description: 'Mensualité Janvier 2024',
      amount: 15000,
      dueDate: '2024-01-31',
      paidDate: '2024-01-28',
      status: 'paid',
      paymentMethod: 'Virement bancaire'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      description: 'Mensualité Février 2024',
      amount: 15000,
      dueDate: '2024-02-29',
      paidDate: null,
      status: 'pending',
      paymentMethod: null
    },
    {
      id: '3',
      invoiceNumber: 'INV-2023-012',
      description: 'Mensualité Décembre 2023',
      amount: 15000,
      dueDate: '2023-12-31',
      paidDate: '2023-12-30',
      status: 'paid',
      paymentMethod: 'Espèces'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2023-011',
      description: 'Mensualité Novembre 2023',
      amount: 15000,
      dueDate: '2023-11-30',
      paidDate: '2023-12-05',
      status: 'paid',
      paymentMethod: 'Chèque'
    }
  ];

  const childInfo = {
    name: 'Yasmine Benali',
    monthlyFee: 15000,
    plan: 'Temps plein'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            En retard
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = paymentHistory.filter(p => p.status === 'paid').reduce((acc, payment) => acc + payment.amount, 0);
  const totalPending = paymentHistory.filter(p => p.status === 'pending').reduce((acc, payment) => acc + payment.amount, 0);
  const nextPaymentDue = paymentHistory.find(p => p.status === 'pending');

  return (
    <ParentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-600">Consultez l'historique des paiements pour {childInfo.name}</p>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{childInfo.monthlyFee.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">Mensualité</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">Total payé</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{totalPending.toLocaleString()} DA</div>
              <div className="text-sm text-gray-600">En attente</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{paymentHistory.length}</div>
              <div className="text-sm text-gray-600">Factures total</div>
            </CardContent>
          </Card>
        </div>

        {/* Next Payment Due */}
        {nextPaymentDue && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                Prochaine échéance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{nextPaymentDue.description}</h3>
                  <p className="text-gray-600">Montant: {nextPaymentDue.amount.toLocaleString()} DA</p>
                  <p className="text-gray-600">Échéance: {new Date(nextPaymentDue.dueDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <Button className="bg-green-500 hover:bg-green-600 mb-2">
                    Payer maintenant
                  </Button>
                  <br />
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger facture
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
              Informations de facturation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Enfant</label>
                <p className="text-gray-900">{childInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Formule</label>
                <p className="text-gray-900">{childInfo.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tarif mensuel</label>
                <p className="text-gray-900 font-semibold">{childInfo.monthlyFee.toLocaleString()} DA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par description ou numéro de facture..."
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

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Facture</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-left p-4 font-medium">Montant</th>
                    <th className="text-left p-4 font-medium">Échéance</th>
                    <th className="text-left p-4 font-medium">Date de paiement</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                          {payment.invoiceNumber}
                        </div>
                      </td>
                      <td className="p-4">{payment.description}</td>
                      <td className="p-4 font-medium">{payment.amount.toLocaleString()} DA</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="p-4">
                        {payment.paidDate ? (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(payment.paidDate).toLocaleDateString('fr-FR')}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="p-4">{getStatusBadge(payment.status)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                          {payment.status === 'pending' && (
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              Payer
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
                    : 'L\'historique des paiements apparaîtra ici'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Modes de paiement acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center p-4 border rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                <div>
                  <div className="font-medium">Virement bancaire</div>
                  <div className="text-sm text-gray-600">RIB disponible</div>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <div className="font-medium">Espèces</div>
                  <div className="text-sm text-gray-600">À la crèche</div>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <Receipt className="w-6 h-6 text-purple-500 mr-3" />
                <div>
                  <div className="font-medium">Chèque</div>
                  <div className="text-sm text-gray-600">À l'ordre de Ma Crèche</div>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-500 mr-3" />
                <div>
                  <div className="font-medium">Carte bancaire</div>
                  <div className="text-sm text-gray-600">En ligne</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
};

export default Payments;