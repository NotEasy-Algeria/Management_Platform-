import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ParentLayout from '@/components/ParentLayout';
import { 
  MessageCircle, 
  Plus, 
  Send, 
  User,
  Clock,
  Search,
  Heart,
  AlertCircle,
  Info,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const Remarks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Mock data - would come from API in production
  const [messages, setMessages] = useState([
    {
      id: '1',
      from: 'Amina Bensaid',
      fromRole: 'educator',
      to: 'Parent',
      subject: 'Excellente journée pour Yasmine',
      message: 'Yasmine a eu une excellente journée aujourd\'hui ! Elle a participé activement aux activités artistiques et a montré beaucoup de créativité. Elle a aussi très bien mangé et a fait une bonne sieste.',
      date: '2024-01-15',
      time: '16:30',
      type: 'positive',
      read: true
    },
    {
      id: '2',
      from: 'Parent',
      fromRole: 'parent',
      to: 'Amina Bensaid',
      subject: 'Question sur l\'alimentation',
      message: 'Bonjour, j\'aimerais savoir si Yasmine mange bien à la crèche. Elle semble avoir moins d\'appétit à la maison ces derniers jours.',
      date: '2024-01-14',
      time: '18:00',
      type: 'question',
      read: true
    },
    {
      id: '3',
      from: 'Amina Bensaid',
      fromRole: 'educator',
      to: 'Parent',
      subject: 'Réponse - Alimentation de Yasmine',
      message: 'Bonjour ! Yasmine mange très bien à la crèche. Elle finit généralement son repas et goûte à tout. Il est normal que l\'appétit varie selon l\'activité et l\'environnement. Je vous tiendrai informé de son comportement alimentaire.',
      date: '2024-01-14',
      time: '19:15',
      type: 'info',
      read: true
    },
    {
      id: '4',
      from: 'Karim Djelloul',
      fromRole: 'educator',
      to: 'Parent',
      subject: 'Progrès en éveil musical',
      message: 'Yasmine fait de beaux progrès en éveil musical ! Elle commence à mémoriser les paroles des chansons et participe avec enthousiasme. C\'est un plaisir de la voir s\'épanouir dans cette activité.',
      date: '2024-01-13',
      time: '15:45',
      type: 'positive',
      read: false
    },
    {
      id: '5',
      from: 'Amina Bensaid',
      fromRole: 'educator',
      to: 'Parent',
      subject: 'Petit incident aujourd\'hui',
      message: 'Yasmine a eu une petite chute dans la cour aujourd\'hui, mais rien de grave. Elle s\'est écorché le genou, nous avons désinfecté et mis un pansement. Elle a été très courageuse !',
      date: '2024-01-12',
      time: '14:20',
      type: 'alert',
      read: true
    }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }

    const message = {
      id: Date.now().toString(),
      from: 'Parent',
      fromRole: 'parent' as const,
      to: 'Amina Bensaid',
      subject: 'Nouveau message',
      message: newMessage,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'question' as const,
      read: true
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setIsDialogOpen(false);
    toast.success('Message envoyé avec succès !');
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <Heart className="w-5 h-5 text-green-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'question':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMessageBadge = (type: string) => {
    switch (type) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800">Positif</Badge>;
      case 'alert':
        return <Badge className="bg-red-100 text-red-800">Alerte</Badge>;
      case 'question':
        return <Badge className="bg-blue-100 text-blue-800">Question</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Information</Badge>;
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.read && m.fromRole === 'educator').length;
  const positiveCount = messages.filter(m => m.type === 'positive').length;
  const alertCount = messages.filter(m => m.type === 'alert').length;

  return (
    <ParentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Communication avec l'équipe pédagogique</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Envoyer un message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">À</label>
                  <Input value="Amina Bensaid (Éducatrice)" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message *</label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message ici..."
                    rows={5}
                    className="resize-none"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
              <div className="text-sm text-gray-600">Total messages</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">{unreadCount}</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Non lus</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{positiveCount}</div>
              <div className="text-sm text-gray-600">Messages positifs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{alertCount}</div>
              <div className="text-sm text-gray-600">Alertes</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className={`hover:shadow-md transition-shadow ${!message.read ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getMessageIcon(message.type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{message.subject}</span>
                        {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{message.from}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(message.date).toLocaleDateString('fr-FR')} à {message.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getMessageBadge(message.type)}
                    {message.fromRole === 'parent' && (
                      <Badge variant="outline" className="text-xs">Envoyé</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{message.message}</p>
                
                {message.fromRole === 'educator' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Répondre
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun message trouvé' : 'Aucun message'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche' 
                  : 'Les messages de l\'équipe pédagogique apparaîtront ici'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <MessageCircle className="w-5 h-5 mr-3 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Poser une question</div>
                  <div className="text-sm text-gray-600">Contactez l'éducatrice</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <Phone className="w-5 h-5 mr-3 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Appel d'urgence</div>
                  <div className="text-sm text-gray-600">+213 555 123 456</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Signaler une absence</div>
                  <div className="text-sm text-gray-600">Prévenir la crèche</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <Info className="w-5 h-5 mr-3 text-orange-500" />
                <div className="text-left">
                  <div className="font-medium">Informations générales</div>
                  <div className="text-sm text-gray-600">Horaires, règlement</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
};

export default Remarks;