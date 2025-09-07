import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, Edit, Trash2, GraduationCap } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useEducators } from '@/hooks/useApi';
import { Educator } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

const EducatorsManagement = () => {
  const { educators, loading, error, createEducator, updateEducator, deleteEducator } = useEducators();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducator, setEditingEducator] = useState<Educator | null>(null);
  const [deleteEducatorId, setDeleteEducatorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    specialties: [] as string[],
    experience: '',
    status: 'active' as 'active' | 'inactive'
  });

  const specialtyOptions = [
    'Développement cognitif',
    'Arts créatifs',
    'Musique et chant',
    'Activités physiques',
    'Langues',
    'Sciences et nature',
    'Mathématiques ludiques',
    'Lecture et écriture',
    'Cuisine pédagogique',
    'Jardinage'
  ];

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      specialties: [],
      experience: '',
      status: 'active'
    });
    setEditingEducator(null);
  };

  const handleEdit = (educator: Educator) => {
    setEditingEducator(educator);
    setFormData({
      firstName: educator.firstName,
      lastName: educator.lastName,
      email: educator.email,
      phone: educator.phone,
      role: educator.role,
      specialties: educator.specialties,
      experience: educator.experience,
      status: educator.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingEducator) {
        await updateEducator(editingEducator.id, formData);
        toast.success('Éducateur modifié avec succès !');
      } else {
        await createEducator(formData);
        toast.success('Éducateur ajouté avec succès !');
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
    if (!deleteEducatorId) return;
    
    try {
      await deleteEducator(deleteEducatorId);
      toast.success('Éducateur supprimé avec succès !');
      setDeleteEducatorId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
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

  const filteredEducators = educators.filter(educator =>
    educator.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    educator.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    educator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    educator.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des éducateurs</h1>
            <p className="text-gray-600">Gérez l'équipe pédagogique</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-purple-500 hover:bg-purple-600"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel éducateur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEducator ? 'Modifier l\'éducateur' : 'Ajouter un éducateur'}
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
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Rôle/Poste *</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Directrice">Directrice</SelectItem>
                      <SelectItem value="Éducatrice principale">Éducatrice principale</SelectItem>
                      <SelectItem value="Éducatrice">Éducatrice</SelectItem>
                      <SelectItem value="Éducatrice spécialisée">Éducatrice spécialisée</SelectItem>
                      <SelectItem value="Assistante éducatrice">Assistante éducatrice</SelectItem>
                      <SelectItem value="Auxiliaire de puériculture">Auxiliaire de puériculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Expérience *</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'expérience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moins de 1 an">Moins de 1 an</SelectItem>
                      <SelectItem value="1-2 ans">1-2 ans</SelectItem>
                      <SelectItem value="3-5 ans">3-5 ans</SelectItem>
                      <SelectItem value="6-10 ans">6-10 ans</SelectItem>
                      <SelectItem value="Plus de 10 ans">Plus de 10 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Spécialités</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                    {specialtyOptions.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="rounded"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
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
                    className="bg-purple-500 hover:bg-purple-600 flex-1"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      editingEducator ? 'Modifier' : 'Ajouter'
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
                placeholder="Rechercher un éducateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Educators List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEducators.map((educator) => (
            <Card key={educator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{educator.firstName} {educator.lastName}</CardTitle>
                      <p className="text-sm text-gray-600">{educator.role}</p>
                    </div>
                  </div>
                  {getStatusBadge(educator.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email:</p>
                  <p className="text-gray-600 text-sm">{educator.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Téléphone:</p>
                  <p className="text-gray-600">{educator.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Expérience:</p>
                  <p className="text-gray-600">{educator.experience}</p>
                </div>
                {educator.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Spécialités:</p>
                    <div className="flex flex-wrap gap-1">
                      {educator.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {educator.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{educator.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex space-x-2 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEdit(educator)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeleteEducatorId(educator.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEducators.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun éducateur trouvé' : 'Aucun éducateur ajouté'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche' 
                  : 'Commencez par ajouter le premier éducateur'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{educators.length}</div>
              <div className="text-sm text-gray-600">Total éducateurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {educators.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {educators.filter(e => e.role.includes('principale') || e.role.includes('Directrice')).length}
              </div>
              <div className="text-sm text-gray-600">Postes senior</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {educators.filter(e => e.experience.includes('Plus de') || e.experience.includes('6-10')).length}
              </div>
              <div className="text-sm text-gray-600">Expérimentés</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteEducatorId}
        onOpenChange={(open) => !open && setDeleteEducatorId(null)}
        title="Supprimer l'éducateur"
        description="Êtes-vous sûr de vouloir supprimer cet éducateur ? Cette action ne peut pas être annulée."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default EducatorsManagement;