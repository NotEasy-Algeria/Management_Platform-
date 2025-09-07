import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus, Search, Edit, Trash2, Users, Clock } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useCourses, useEducators } from '@/hooks/useApi';
import { Course } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

const CoursesManagement = () => {
  const { courses, loading, error, createCourse, updateCourse, deleteCourse } = useCourses();
  const { educators } = useEducators();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    duration: '',
    instructorId: '',
    schedule: '',
    maxParticipants: 15
  });

  const ageGroups = [
    '6 mois - 1 an',
    '1 - 2 ans',
    '2 - 3 ans',
    '3 - 4 ans',
    '4 - 5 ans',
    '2 - 5 ans',
    'Tous âges'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      ageGroup: '',
      duration: '',
      instructorId: '',
      schedule: '',
      maxParticipants: 15
    });
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      ageGroup: course.ageGroup,
      duration: course.duration,
      instructorId: course.instructorId,
      schedule: course.schedule,
      maxParticipants: course.maxParticipants
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const instructor = educators.find(e => e.id === formData.instructorId);
      const courseData = {
        ...formData,
        instructorName: instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Instructeur non trouvé',
        participants: editingCourse?.participants || 0
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        toast.success('Cours modifié avec succès !');
      } else {
        await createCourse(courseData);
        toast.success('Cours ajouté avec succès !');
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
    if (!deleteCourseId) return;
    
    try {
      await deleteCourse(deleteCourseId);
      toast.success('Cours supprimé avec succès !');
      setDeleteCourseId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const getAgeGroupBadge = (ageGroup: string) => {
    const colors = [
      'bg-pink-100 text-pink-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800'
    ];
    const colorIndex = ageGroup.length % colors.length;
    return <Badge className={colors[colorIndex]}>{ageGroup}</Badge>;
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.ageGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des cours</h1>
            <p className="text-gray-600">Gérez les activités et cours proposés</p>
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
                Nouveau cours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Modifier le cours' : 'Ajouter un cours'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du cours *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Arts créatifs, Éveil musical..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez les objectifs et activités du cours..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageGroup">Tranche d'âge *</Label>
                    <Select 
                      value={formData.ageGroup} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'âge" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Durée *</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Durée du cours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 min">30 minutes</SelectItem>
                        <SelectItem value="45 min">45 minutes</SelectItem>
                        <SelectItem value="1h">1 heure</SelectItem>
                        <SelectItem value="1h30">1h30</SelectItem>
                        <SelectItem value="2h">2 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructorId">Instructeur *</Label>
                  <Select 
                    value={formData.instructorId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, instructorId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un éducateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {educators.filter(e => e.status === 'active').map((educator) => (
                        <SelectItem key={educator.id} value={educator.id}>
                          {educator.firstName} {educator.lastName} - {educator.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="schedule">Planning *</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="Ex: Lundi, Mercredi, Vendredi 10h00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 15 }))}
                  />
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
                      editingCourse ? 'Modifier' : 'Ajouter'
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
                placeholder="Rechercher un cours ou instructeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <p className="text-sm text-gray-600">{course.instructorName}</p>
                    </div>
                  </div>
                  {getAgeGroupBadge(course.ageGroup)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm">{course.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.participants}/{course.maxParticipants}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Planning:</p>
                  <p className="text-gray-600 text-sm">{course.schedule}</p>
                </div>

                <div className="flex space-x-2 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeleteCourseId(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun cours trouvé' : 'Aucun cours créé'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche' 
                  : 'Commencez par ajouter le premier cours'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{courses.length}</div>
              <div className="text-sm text-gray-600">Cours proposés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {courses.reduce((acc, course) => acc + course.participants, 0)}
              </div>
              <div className="text-sm text-gray-600">Participants total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {courses.filter(c => c.participants >= c.maxParticipants * 0.8).length}
              </div>
              <div className="text-sm text-gray-600">Cours populaires</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {Math.round(courses.reduce((acc, course) => acc + (course.participants / course.maxParticipants), 0) / courses.length * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Taux de remplissage</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteCourseId}
        onOpenChange={(open) => !open && setDeleteCourseId(null)}
        title="Supprimer le cours"
        description="Êtes-vous sûr de vouloir supprimer ce cours ? Cette action ne peut pas être annulée."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default CoursesManagement;