import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParentLayout from '@/components/ParentLayout';
import { 
  Baby, 
  Calendar, 
  Heart, 
  BookOpen, 
  Camera,
  FileText,
  User,
  Phone,
  MapPin,
  Clock,
  Activity,
  CheckCircle,
  X
} from 'lucide-react';

const ChildInfo = () => {
  const [selectedTab, setSelectedTab] = useState('profile');

  // Mock data - would come from API in production
  const childData = {
    id: '1',
    firstName: 'Yasmine',
    lastName: 'Benali',
    birthDate: '2021-03-15',
    age: 3,
    group: 'Groupe Moyen',
    enrollmentDate: '2024-01-15',
    educator: 'Amina Bensaid',
    medicalInfo: 'RAS',
    allergies: 'Aucune',
    emergencyContact: 'Ahmed Benali - +213 555 654 321',
    status: 'active',
    photo: null
  };

  const recentActivities = [
    {
      date: '2024-01-15',
      time: '10:30',
      activity: 'Arts créatifs',
      description: 'Yasmine a créé une belle peinture représentant sa famille. Elle a montré beaucoup de créativité et de concentration.',
      educator: 'Amina Bensaid',
      photos: 3,
      skills: ['Créativité', 'Concentration', 'Motricité fine']
    },
    {
      date: '2024-01-15',
      time: '14:00',
      activity: 'Éveil musical',
      description: 'Participation active aux chansons traditionnelles. Yasmine commence à mémoriser les paroles.',
      educator: 'Karim Djelloul',
      photos: 1,
      skills: ['Mémoire', 'Expression orale', 'Rythme']
    },
    {
      date: '2024-01-14',
      time: '15:30',
      activity: 'Jeux extérieurs',
      description: 'Excellente socialisation avec les autres enfants. Partage et coopération remarquables.',
      educator: 'Amina Bensaid',
      photos: 4,
      skills: ['Socialisation', 'Partage', 'Motricité globale']
    }
  ];

  const attendanceData = [
    { date: '2024-01-15', status: 'present', arrivalTime: '08:30', departureTime: '16:00' },
    { date: '2024-01-14', status: 'present', arrivalTime: '08:45', departureTime: '15:45' },
    { date: '2024-01-13', status: 'present', arrivalTime: '08:30', departureTime: '16:00' },
    { date: '2024-01-12', status: 'absent', reason: 'Maladie' },
    { date: '2024-01-11', status: 'present', arrivalTime: '09:00', departureTime: '16:00' }
  ];

  const developmentMilestones = [
    {
      category: 'Développement moteur',
      skills: [
        { skill: 'Court sans tomber', achieved: true, date: '2024-01-10' },
        { skill: 'Monte les escaliers alternativement', achieved: true, date: '2024-01-05' },
        { skill: 'Pédale sur un tricycle', achieved: false, target: '2024-02-15' }
      ]
    },
    {
      category: 'Développement cognitif',
      skills: [
        { skill: 'Compte jusqu\'à 10', achieved: true, date: '2024-01-12' },
        { skill: 'Reconnaît les couleurs primaires', achieved: true, date: '2024-01-08' },
        { skill: 'Forme des phrases de 4-5 mots', achieved: true, date: '2024-01-14' }
      ]
    },
    {
      category: 'Développement social',
      skills: [
        { skill: 'Joue avec d\'autres enfants', achieved: true, date: '2024-01-11' },
        { skill: 'Partage ses jouets', achieved: true, date: '2024-01-13' },
        { skill: 'Exprime ses émotions', achieved: false, target: '2024-02-01' }
      ]
    }
  ];

  const getAttendanceIcon = (status: string) => {
    return status === 'present' ? 
      <Badge className="bg-green-100 text-green-800">Présent</Badge> :
      <Badge className="bg-red-100 text-red-800">Absent</Badge>;
  };

  return (
    <ParentLayout>
      <div className="space-y-8">
        {/* Header with Child Info */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center">
              {childData.photo ? (
                <img src={childData.photo} alt={childData.firstName} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <Baby className="w-12 h-12 text-pink-600" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {childData.firstName} {childData.lastName}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Âge:</span>
                  <div className="font-semibold">{childData.age} ans</div>
                </div>
                <div>
                  <span className="text-gray-600">Groupe:</span>
                  <div className="font-semibold">{childData.group}</div>
                </div>
                <div>
                  <span className="text-gray-600">Éducatrice:</span>
                  <div className="font-semibold">{childData.educator}</div>
                </div>
                <div>
                  <span className="text-gray-600">Inscription:</span>
                  <div className="font-semibold">{new Date(childData.enrollmentDate).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              Actif
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="attendance">Présences</TabsTrigger>
            <TabsTrigger value="development">Développement</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nom complet</label>
                    <p className="text-gray-900">{childData.firstName} {childData.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                    <p className="text-gray-900">{new Date(childData.birthDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Âge</label>
                    <p className="text-gray-900">{childData.age} ans</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Groupe</label>
                    <p className="text-gray-900">{childData.group}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date d'inscription</label>
                    <p className="text-gray-900">{new Date(childData.enrollmentDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Informations médicales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Informations médicales</label>
                    <p className="text-gray-900">{childData.medicalInfo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allergies</label>
                    <p className="text-gray-900">{childData.allergies}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact d'urgence</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {childData.emergencyContact}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Éducatrice référente</label>
                    <p className="text-gray-900">{childData.educator}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="mt-6">
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                        {activity.activity}
                      </CardTitle>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString('fr-FR')} à {activity.time}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{activity.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Compétences développées:</p>
                        <div className="flex flex-wrap gap-2">
                          {activity.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Par {activity.educator}</p>
                        <div className="flex items-center mt-2">
                          <Camera className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-600">{activity.photos} photo{activity.photos > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Historique des présences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Statut</th>
                        <th className="text-left p-4 font-medium">Arrivée</th>
                        <th className="text-left p-4 font-medium">Départ</th>
                        <th className="text-left p-4 font-medium">Remarques</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4">{new Date(record.date).toLocaleDateString('fr-FR')}</td>
                          <td className="p-4">{getAttendanceIcon(record.status)}</td>
                          <td className="p-4">
                            {record.arrivalTime ? (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                {record.arrivalTime}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="p-4">
                            {record.departureTime ? (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                {record.departureTime}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="p-4">{record.reason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {attendanceData.filter(r => r.status === 'present').length}
                      </div>
                      <div className="text-sm text-gray-600">Jours présents</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {attendanceData.filter(r => r.status === 'absent').length}
                      </div>
                      <div className="text-sm text-gray-600">Jours absents</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {Math.round((attendanceData.filter(r => r.status === 'present').length / attendanceData.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Taux de présence</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="mt-6">
            <div className="space-y-6">
              {developmentMilestones.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-purple-500" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.skills.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {item.achieved ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <X className="w-5 h-5 text-gray-400" />
                            )}
                            <span className={`font-medium ${item.achieved ? 'text-gray-900' : 'text-gray-500'}`}>
                              {item.skill}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.achieved ? (
                              <Badge className="bg-green-100 text-green-800">
                                Acquis le {new Date(item.date).toLocaleDateString('fr-FR')}
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Objectif: {new Date(item.target).toLocaleDateString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ParentLayout>
  );
};

export default ChildInfo;