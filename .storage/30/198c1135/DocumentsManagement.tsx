import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Search, Download, Eye, Upload, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useChildren } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface Document {
  id: string;
  childId: string;
  childName: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  category: 'medical' | 'administrative' | 'photo' | 'other';
  status: 'pending' | 'approved' | 'rejected';
}

const DocumentsManagement = () => {
  const { children, loading: childrenLoading } = useChildren();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      childId: '1',
      childName: 'Yasmine Benali',
      fileName: 'certificat_medical_yasmine.pdf',
      fileType: 'PDF',
      fileSize: '245 KB',
      uploadDate: '2024-01-15',
      category: 'medical',
      status: 'approved'
    },
    {
      id: '2',
      childId: '2',
      childName: 'Rayan Khelifi',
      fileName: 'photo_identite_rayan.jpg',
      fileType: 'JPG',
      fileSize: '1.2 MB',
      uploadDate: '2024-01-12',
      category: 'photo',
      status: 'pending'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    childId: '',
    category: 'medical' as 'medical' | 'administrative' | 'photo' | 'other',
    file: null as File | null
  });

  const categories = [
    { value: 'medical', label: 'Médical', color: 'bg-red-100 text-red-800' },
    { value: 'administrative', label: 'Administratif', color: 'bg-blue-100 text-blue-800' },
    { value: 'photo', label: 'Photo', color: 'bg-green-100 text-green-800' },
    { value: 'other', label: 'Autre', color: 'bg-gray-100 text-gray-800' }
  ];

  const resetForm = () => {
    setFormData({
      childId: '',
      category: 'medical',
      file: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.childId) {
      toast.error('Veuillez sélectionner un enfant et un fichier');
      return;
    }

    setIsSubmitting(true);

    try {
      const child = children.find(c => c.id === formData.childId);
      const newDocument: Document = {
        id: Date.now().toString(),
        childId: formData.childId,
        childName: child ? `${child.firstName} ${child.lastName}` : 'Enfant non trouvé',
        fileName: formData.file.name,
        fileType: formData.file.name.split('.').pop()?.toUpperCase() || 'Unknown',
        fileSize: `${Math.round(formData.file.size / 1024)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        category: formData.category,
        status: 'pending'
      };

      setDocuments(prev => [...prev, newDocument]);
      toast.success('Document ajouté avec succès !');
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Erreur lors de l\'ajout du document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDocumentId) return;
    
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== deleteDocumentId));
      toast.success('Document supprimé avec succès !');
      setDeleteDocumentId(null);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const updateDocumentStatus = (documentId: string, status: 'approved' | 'rejected') => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, status } : doc
    ));
    toast.success(`Document ${status === 'approved' ? 'approuvé' : 'rejeté'} !`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return <Badge className={cat?.color}>{cat?.label}</Badge>;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (childrenLoading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des documents</h1>
            <p className="text-gray-600">Gérez les documents des enfants</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un document</DialogTitle>
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
                          {child.firstName} {child.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: 'medical' | 'administrative' | 'photo' | 'other') => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
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
                  <Label htmlFor="file">Fichier *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      file: e.target.files?.[0] || null 
                    }))}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Formats acceptés: PDF, JPG, PNG, DOC, DOCX (max 5MB)
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 flex-1"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : 'Ajouter'}
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

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par enfant ou fichier..."
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
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{documents.length}</div>
              <div className="text-sm text-gray-600">Total documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {documents.filter(d => d.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approuvés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {documents.filter(d => d.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {documents.filter(d => d.category === 'medical').length}
              </div>
              <div className="text-sm text-gray-600">Médicaux</div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Fichier</th>
                    <th className="text-left p-4 font-medium">Enfant</th>
                    <th className="text-left p-4 font-medium">Catégorie</th>
                    <th className="text-left p-4 font-medium">Taille</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          <div>
                            <div className="font-medium">{document.fileName}</div>
                            <div className="text-sm text-gray-500">{document.fileType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{document.childName}</td>
                      <td className="p-4">{getCategoryBadge(document.category)}</td>
                      <td className="p-4">{document.fileSize}</td>
                      <td className="p-4">{new Date(document.uploadDate).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">{getStatusBadge(document.status)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          {document.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => updateDocumentStatus(document.id, 'approved')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => updateDocumentStatus(document.id, 'rejected')}
                              >
                                ✗
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteDocumentId(document.id)}
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

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'all' ? 'Aucun document trouvé' : 'Aucun document'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Essayez de modifier vos filtres' 
                    : 'Commencez par ajouter le premier document'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteDocumentId}
        onOpenChange={(open) => !open && setDeleteDocumentId(null)}
        title="Supprimer le document"
        description="Êtes-vous sûr de vouloir supprimer ce document ? Cette action ne peut pas être annulée."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default DocumentsManagement;