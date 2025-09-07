import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParentLayout from '@/components/ParentLayout';
import { 
  Baby, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Heart
} from 'lucide-react';

const ParentDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data - would come from API in production
  const childInfo = {
    name: 'Yasmine',
    age: '3 ans',
    group: 'Groupe Moyen',
    educator: 'Amina Bensaid',
    lastAttendance: '2024-01-15',
    attendanceRate: 96
  };

  const recentActivities = [
    {
      date: '2024-01-15',
      activity: 'Arts créatifs',
      description: 'Peinture à l\'eau - Yasmine a créé un beau paysage',
      educator: 'Amina Bensaid',
      photos: 2
    },
    {
      date: '2024-01-15',
      activity: 'Éveil musical',
      description: 'Chansons traditionnelles algériennes',
      educator: 'Karim Djelloul',
      photos: 1
    },
    {
      date: '2024-01-14',
      activity: 'Jeux extérieurs',
      description: 'Jeux dans la cour avec les autres enfants',
      educator: 'Amina Bensaid',
      photos: 3
    }
  ];

  const upcomingEvents = [
    {
      date: '2024-01-20',
      title: 'Réunion parents-éducateurs',
      time: '14:00',
      type: 'meeting'
    },
    {
      date: '2024-01-25',
      title: 'Spectacle de fin d\'année',
      time: '15:30',
      type: 'event'
    }
  ];

  const recentRemarks = [
    {
      date: '2024-01-15',
      educator: 'Amina Bensaid',
      message: 'Yasmine a très bien participé aux activités artistiques aujourd\'hui. Elle montre beaucoup de créativité !',
      type: 'positive'
    },
    {
      date: '2024-01-12',
      educator: 'Karim Djelloul',
      message: 'Yasmine a bien mangé aujourd\'hui et a fait une bonne sieste.',
      type: 'info'
    }
  ];

  const paymentStatus = {
    currentMonth: 'Janvier 2024',
    amount: '15,000 DA',
    status: 'paid',
    dueDate: '2024-01-31',
    nextPayment: '15,000 DA'
  };

  return (
    <ParentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour ! Voici les nouvelles de {childInfo.name}
            </h1>
            <p className="text-gray-600">Tableau de bord parent</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
            >
              Semaine
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
            >
              Mois
            </Button>
          </div>
        </div>

        {/* Child Overview */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
                <Baby className="w-8 h-8 text-pink-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{childInfo.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600 mt-1">
                  <span>{childInfo.age}</span>
                  <span>•</span>
                  <span>{childInfo.group}</span>
                  <span>•</span>
                  <span>Éducatrice: {childInfo.educator}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{childInfo.attendanceRate}%</div>
                <div className="text-sm text-gray-600">Taux de présence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">18</div>
              <div className="text-sm text-gray-600">Jours présents ce mois</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-600">Activités réalisées</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Nouveaux messages</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Paiement à jour</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-pink-500" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-pink-200 pl-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Par {activity.educator}</span>
                        <Badge variant="outline" className="text-blue-600">
                          {activity.photos} photo{activity.photos > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Statut des paiements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{paymentStatus.currentMonth}</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Payé
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold">{paymentStatus.amount}</div>
                  <div className="text-sm text-gray-500">
                    Prochaine échéance: {paymentStatus.dueDate}
                  </div>
                  <Button size="sm" className="w-full" variant="outline">
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Événements à venir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Calendar className="w-5 h-5 text-pink-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.date} à {event.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Remarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-500" />
                  Messages récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRemarks.slice(0, 2).map((remark, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{remark.educator}</span>
                        <span className="text-xs text-gray-500">{remark.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{remark.message}</p>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full">
                    Voir tous les messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};

export default ParentDashboard;