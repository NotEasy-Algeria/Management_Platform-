import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Clock, Users, BookOpen, Edit, Trash2, CheckCircle, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useCourses, useEducators } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface ScheduleEvent {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  educatorId: string;
  educatorName: string;
  date: string;
  startTime: string;
  endTime: string;
  group: string;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const ScheduleManagement = () => {
  const { courses } = useCourses();
  const { educators } = useEducators();
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Arts Créatifs - Groupe Moyen',
      courseId: '1',
      courseName: 'Arts Créatifs',
      educatorId: '1',
      educatorName: 'Amina Bensaid',
      date: '2024-01-22',
      startTime: '10:00',
      endTime: '10:45',
      group: 'Groupe Moyen',
      participants: 8,
      maxParticipants: 12,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Éveil Musical - Groupe Grand',
      courseId: '2',
      courseName: 'Éveil Musical',
      educatorId: '1',
      educatorName: 'Amina Bensaid',
      date: '2024-01-22',
      startTime: '14:00',
      endTime: '14:45',
      group: 'Groupe Grand',
      participants: 10,
      maxParticipants: 15,
      status: 'scheduled'
    }
  ]);

  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    courseId: '',
    educatorId: '',
    date: '',
    startTime: '',
    endTime: '',
    group: '',
    maxParticipants: 15
  });

  const groups = ['Groupe Petit', 'Groupe Moyen', 'Groupe Grand'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const resetForm = () => {
    setFormData({
      courseId: '',
      educatorId: '',
      date: '',
      startTime: '',
      endTime: '',
      group: '',
      maxParticipants: 15
    });
    setEditingEvent(null);
  };

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      courseId: event.courseId,
      educatorId: event.educatorId,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      group: event.group,
      maxParticipants: event.maxParticipants
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const course = courses.find(c => c.id === formData.courseId);
      const educator = educators.find(e => e.id === formData.educatorId);
      
      const eventData: ScheduleEvent = {
        id: editingEvent?.id || Date.now().toString(),
        title: `${course?.name} - ${formData.group}`,
        courseId: formData.courseId,
        courseName: course?.name || 'Cours non trouvé',
        educatorId: formData.educatorId,
        educatorName: educator ? `${educator.firstName} ${educator.lastName}` : 'Éducateur non trouvé',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        group: formData.group,
        participants: editingEvent?.participants || 0,
        maxParticipants: formData.maxParticipants,
        status: 'scheduled'
      };

      if (editingEvent) {
        setEvents(prev => prev.map(event => event.id === editingEvent.id ? eventData : event));
        toast.success('Événement modifié avec succès !');
      } else {
        setEvents(prev => [...prev, eventData]);
        toast.success('Événement ajouté avec succès !');
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
    if (!deleteEventId) return;
    
    try {
      setEvents(prev => prev.filter(event => event.id !== deleteEventId));
      toast.success('Événement supprimé avec succès !');
      setDeleteEventId(null);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const updateEventStatus = (eventId: string, status: 'completed' | 'cancelled') => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, status } : event
    ));
    toast.success(`Événement marqué comme ${status === 'completed' ? 'terminé' : 'annulé'} !`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Programmé</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getWeekDays = (weekStart: string) => {
    const start = new Date(weekStart);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const weekDays = getWeekDays(selectedWeek);
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion du planning</h1>
            <p className="text-gray-600">Planifiez les cours et activités</p>
          </div>
          <div className="flex space-x-3">
            <Input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-40"
            />
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
                  Nouvel événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="courseId">Cours *</Label>
                    <Select 
                      value={formData.courseId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="educatorId">Éducateur *</Label>
                    <Select 
                      value={formData.educatorId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, educatorId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un éducateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {educators.filter(e => e.status === 'active').map((educator) => (
                          <SelectItem key={educator.id} value={educator.id}>
                            {educator.firstName} {educator.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Label htmlFor="group">Groupe *</Label>
                      <Select 
                        value={formData.group} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Heure de début *</Label>
                      <Select 
                        value={formData.startTime} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Heure de début" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="endTime">Heure de fin *</Label>
                      <Select 
                        value={formData.endTime} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Heure de fin" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                      className="bg-blue-500 hover:bg-blue-600 flex-1"
                    >
                      {isSubmitting ? <LoadingSpinner size="sm" /> : (editingEvent ? 'Modifier' : 'Ajouter')}
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
        </div>

        {/* Weekly Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Planning hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div key={day.toISOString()} className={`border rounded-lg p-3 min-h-[200px] ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                    <div className="text-center mb-3">
                      <div className="font-semibold text-gray-900">{dayNames[index]}</div>
                      <div className={`text-sm ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                        {day.getDate()}/{day.getMonth() + 1}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {dayEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`p-2 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow ${
                            event.status === 'scheduled' ? 'bg-blue-100 border-l-2 border-blue-400' :
                            event.status === 'completed' ? 'bg-green-100 border-l-2 border-green-400' :
                            'bg-red-100 border-l-2 border-red-400'
                          }`}
                          onClick={() => handleEdit(event)}
                        >
                          <div className="font-semibold truncate">{event.courseName}</div>
                          <div className="text-gray-600">{event.startTime} - {event.endTime}</div>
                          <div className="text-gray-600">{event.group}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs">{event.participants}/{event.maxParticipants}</span>
                            {getStatusBadge(event.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des événements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Cours</th>
                    <th className="text-left p-4 font-medium">Éducateur</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Horaire</th>
                    <th className="text-left p-4 font-medium">Groupe</th>
                    <th className="text-left p-4 font-medium">Participants</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                          {event.courseName}
                        </div>
                      </td>
                      <td className="p-4">{event.educatorName}</td>
                      <td className="p-4">{new Date(event.date).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {event.startTime} - {event.endTime}
                        </div>
                      </td>
                      <td className="p-4">{event.group}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {event.participants}/{event.maxParticipants}
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(event.status)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {event.status === 'scheduled' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => updateEventStatus(event.id, 'completed')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => updateEventStatus(event.id, 'cancelled')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteEventId(event.id)}
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

            {events.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement planifié</h3>
                <p className="text-gray-600">Commencez par ajouter le premier événement</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{events.length}</div>
              <div className="text-sm text-gray-600">Événements total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {events.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Terminés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {events.filter(e => e.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Programmés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {events.filter(e => e.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600">Annulés</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteEventId}
        onOpenChange={(open) => !open && setDeleteEventId(null)}
        title="Supprimer l'événement"
        description="Êtes-vous sûr de vouloir supprimer cet événement ? Cette action ne peut pas être annulée."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default ScheduleManagement;