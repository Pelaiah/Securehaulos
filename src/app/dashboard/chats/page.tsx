
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  MapPin,
  FileText,
  Check,
  CheckCheck,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialConversations = [
  {
    id: 1,
    name: 'Alex Williams',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    lastMessage: 'Sounds good, I am on my way to the pickup location now.',
    lastMessageTime: '10:42 AM',
    unread: 0,
    messages: [
      { id: 1, text: 'Hey Alex, just confirming the pickup for Load #LD-101 is scheduled for 1 PM today.', sender: 'me', time: '10:40 AM', status: 'read' as const },
      { id: 2, text: 'That is correct. I should be there right on time.', sender: 'other', time: '10:41 AM', status: 'sent' as const },
      { id: 3, text: 'Perfect. The cargo consists of 2 pallets of consumer electronics.', sender: 'me', time: '10:41 AM', status: 'read' as const },
      { id: 4, text: 'Sounds good, I am on my way to the pickup location now.', sender: 'other', time: '10:42 AM', status: 'sent' as const },
    ],
  },
  {
    id: 2,
    name: 'Monika Brown',
    avatar: 'https://i.pravatar.cc/150?u=monika',
    lastMessage: 'Okay, I will let you know once I have passed the weigh station.',
    lastMessageTime: '9:15 AM',
    unread: 2,
    messages: [
      { id: 1, text: 'Hi Monika, how is the trip going for load #LD-102?', sender: 'me', time: '9:14 AM', status: 'delivered' as const },
      { id: 2, text: 'Going smoothly! No issues so far.', sender: 'other', time: '9:15 AM', status: 'sent' as const },
      { id: 3, text: 'Okay, I will let you know once I have passed the weigh station.', sender: 'other', time: '9:15 AM', status: 'sent' as const },
    ],
  },
   {
    id: 3,
    name: 'Harry Johnson',
    avatar: 'https://i.pravatar.cc/150?u=harry',
    lastMessage: 'I have an ETA of 3:30 PM for the delivery in Detroit.',
    lastMessageTime: 'Yesterday',
    unread: 0,
     messages: [
      { id: 1, text: 'ETA update for #LD-103?', sender: 'me', time: '3:28 PM', status: 'sent' as const },
      { id: 2, text: 'I have an ETA of 3:30 PM for the delivery in Detroit.', sender: 'other', time: '3:30 PM', status: 'sent' as const },
    ],
  },
];

type Message = (typeof initialConversations)[0]['messages'][0];
type Conversation = (typeof initialConversations)[0];

const ReadReceipt = ({ status }: { status: Message['status'] }) => {
    if (status === 'read') {
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    if (status === 'delivered') {
        return <CheckCheck className="h-4 w-4" />;
    }
    if (status === 'sent') {
        return <Check className="h-4 w-4" />;
    }
    return null;
}


export default function ChatsPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        { id: Date.now(), text: newMessage, sender: 'me', time, status: 'sent' as const },
      ],
      lastMessage: newMessage,
      lastMessageTime: time,
    };

    const updatedConversations = conversations.map(c => c.id === selectedConversation.id ? updatedConversation : c);
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };
  
  const handleNewChat = () => {
    const newId = Math.max(...conversations.map(c => c.id)) + 1;
    const newConversation: Conversation = {
      id: newId,
      name: `New Contact ${newId}`,
      avatar: `https://i.pravatar.cc/150?u=new${newId}`,
      lastMessage: 'Start a conversation!',
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      messages: [],
    };

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setSelectedConversation(newConversation);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh_-_theme(spacing.16))]">
      {/* Conversation List */}
      <div className="flex flex-col border-r bg-card-alt">
        <div className="p-4 border-b">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Messages</h2>
                 <Button variant="ghost" size="icon" onClick={handleNewChat}>
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-background" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={cn(
                'flex items-start gap-4 p-4 cursor-pointer hover:bg-accent',
                selectedConversation?.id === convo.id && 'bg-accent'
              )}
              onClick={() => setSelectedConversation(convo)}
            >
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={convo.avatar} alt={convo.name} />
                <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{convo.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {convo.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground truncate">
                    {convo.lastMessage}
                  </p>
                  {convo.unread > 0 && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedConversation ? (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b flex items-center gap-4">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-semibold">{selectedConversation.name}</h3>
                <p className="text-sm text-green-500 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                </p>
            </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {selectedConversation.messages.map((message) => (
                <div
                key={message.id}
                className={cn(
                    'flex items-end gap-3',
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                )}
                >
                {message.sender === 'other' && (
                    <Avatar className="h-8 w-8 border self-end">
                        <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                        <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg flex flex-col',
                    message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card'
                )}>
                    <p className="text-sm">{message.text}</p>
                    <div className={cn("flex items-center gap-1.5 self-end mt-1.5", message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                        <span className="text-xs">{message.time}</span>
                        {message.sender === 'me' && <ReadReceipt status={message.status} />}
                    </div>
                </div>
                </div>
            ))}
            </div>
            <div className="p-4 border-t bg-card-alt">
            <div className="relative">
                <Input
                placeholder="Type your message..."
                className="pr-24"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>Picture</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Location</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Document</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" onClick={handleSendMessage}>
                    Send
                    <Send className="h-4 w-4 ml-2" />
                </Button>
                </div>
            </div>
            </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-background">
          <div className="text-center">
            <p className="text-muted-foreground">Select a conversation or start a new one.</p>
          </div>
        </div>
      )}
    </div>
  );
}
