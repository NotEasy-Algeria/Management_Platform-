import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, Edit, Trash2, Baby } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useChildren } from '@/hooks/useApi';
import { Child } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

const ChildrenManagement = () => {
  const { children, loading, error, createChild, updateChild, deleteChild } = useChildren();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [deleteChildId, setDeleteChildId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    age: 0,
    group: '',
    parentName: '',
    enrollmentDate: '',
    medicalInfo: '',
    allergies: '',
    emergencyContact: '',
    status: 'active' as 'active' | 'inactive'
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      age: 0,
      group: '',
      parentName: '',
      enrollmentDate: '',
      medicalInfo: '',
      allergies: '',
      emergencyContact: '',
      status: 'active'
    });
    setEditingChild(null);
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setFormData({
      firstName: child.firstName,
      lastName: child.lastName,
      birthDate: child.birthDate,
      age: child.age,
      group: child.group,
      parentName: child.parentName,
      enrollmentDate: child.enrollmentDate,
      medicalInfo: child.medicalInfo,
      allergies: child.allergies,
      emergencyContact: child.emergencyContact,
      status: child.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingChild) {
        await updateChild(editingChild.id, { ...formData, parentId: editingChild.parentId });
        toast.success('Enfant modifié avec succès !');
      } else {
        await createChild({ ...formData, parentId: Date.now().toString() });
        toast.success('Enfant ajouté avec succès !');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteChildId) return;
    
    try {
      await deleteChild(deleteChildId);
      toast.success('Enfant supprimé avec succès !');
      setDeleteChildId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredChildren = children.filter(child =>
    child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des enfants</h1>
            <p className="text-gray-600">Gérez les profils des enfants inscrits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-pink-500 hover:bg-pink-600"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel enfant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingChild ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Date de naissance *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => {
                        const birthDate = e.target.value;
                        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
                        setFormData(prev => ({ ...prev, birthDate, age }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Âge</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="group">Groupe *</Label>
                    <Select 
                      value={formData.group} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un groupe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Groupe Petit">Groupe Petit (6 mois - 2 ans)</SelectItem>
                        <SelectItem value="Groupe Moyen">Groupe Moyen (2 - 3 ans)</SelectItem>
                        <SelectItem value="Groupe Grand">Groupe Grand (3 - 5 ans)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="enrollmentDate">Date d'inscription *</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, enrollmentDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="parentName">Nom du parent *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Contact d'urgence *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="Nom - Téléphone"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="medicalInfo">Informations médicales</Label>
                  <Input
                    id="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalInfo: e.target.value }))}
                    placeholder="Allergies, médicaments, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    placeholder="Allergies connues"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-pink-500 hover:bg-pink-600 flex-1"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      editingChild ? 'Modifier' : 'Ajouter'
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

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un enfant ou un parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Children List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <Card key={child.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Baby className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{child.firstName} {child.lastName}</CardTitle>
                      <p className="text-sm text-gray-600">{child.age} ans • {child.group}</p>
                    </div>
                  </div>
                  {getStatusBadge(child.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Parent:</p>
                  <p className="text-gray-600">{child.parentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact d'urgence:</p>
                  <p className="text-gray-600 text-sm">{child.emergencyContact}</p>
                </div>
                {child.allergies && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Allergies:</p>
                    <p className="text-gray-600 text-sm">{child.allergies}</p>
                  </div>
                )}
                <div className="flex space-x-2 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEdit(child)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeleteChildId(child.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChildren.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun enfant trouvé' : 'Aucun enfant inscrit'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche' 
                  : 'Commencez par ajouter le premier enfant'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-pink-600 mb-2">{children.length}</div>
              <div className="text-sm text-gray-600">Enfants inscrits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {children.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {children.filter(c => c.group === 'Groupe Petit').length}
              </div>
              <div className="text-sm text-gray-600">Groupe Petit</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {children.filter(c => c.group === 'Groupe Moyen').length}
              </div>
              <div className="text-sm text-gray-600">Groupe Moyen</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteChildId}
        onOpenChange={(open) => !open && setDeleteChildId(null)}
        title="Supprimer l'enfant"
        description="Êtes-vous sûr de vouloir supprimer cet enfant ? Cette action ne peut pas être annulée."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default ChildrenManagement;