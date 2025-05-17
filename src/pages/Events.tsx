import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Clock 
} from 'lucide-react';
import EventList from '../components/events/EventList';
import Modal from '../components/ui/Modal';
import { Event } from '../types';
import { useSupabase } from '../hooks/useSupabase';

const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isViewingEvent, setIsViewingEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => {
    setIsAddingEvent(true);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsAddingEvent(true);
    setIsViewingEvent(false);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewingEvent(true);
    setIsAddingEvent(false);
  };

  const handleSubmitEvent = async (data: Partial<Event>) => {
    try {
      if (selectedEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            title: data.title,
            start_date: data.startDate,
            end_date: data.endDate,
            description: data.description,
            location: data.location,
            budget: data.budget,
            status: data.status,
            organizer: data.organizer,
          })
          .eq('id', selectedEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert({
            title: data.title,
            start_date: data.startDate,
            end_date: data.endDate,
            description: data.description,
            location: data.location,
            budget: data.budget,
            status: data.status,
            organizer: data.organizer,
          });

        if (error) throw error;
      }

      await loadEvents();
      setIsAddingEvent(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const nextEvent = events.find(event => 
    new Date(event.startDate) > new Date() && 
    event.status === 'planned'
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Eventos
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie eventos, reuniões e encontros da igreja.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-primary-500 text-white">
            <div className="flex items-center mb-4">
              <Calendar size={24} className="mr-2 text-secondary-500" />
              <h3 className="text-xl font-semibold">Próximo Evento</h3>
            </div>
            
            {nextEvent ? (
              <>
                <h4 className="text-lg font-semibold mb-2">{nextEvent.title}</h4>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-secondary-300" />
                    <span>{new Date(nextEvent.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-secondary-300" />
                    <span>
                      {new Date(nextEvent.startDate).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(nextEvent.endDate).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-secondary-300" />
                    <span>{nextEvent.location}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleViewEvent(nextEvent)}
                  className="mt-2 btn bg-white text-primary-500 hover:bg-gray-100"
                >
                  Ver Detalhes
                </button>
              </>
            ) : (
              <p className="text-center py-4">Nenhum evento próximo agendado</p>
            )}
          </div>
          
          <div className="card md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-primary-500" />
              Eventos Recorrentes
            </h3>
            
            <div className="space-y-4">
              {[
                { 
                  title: 'Culto Dominical', 
                  time: 'Domingo, 09:00 - 12:00',
                  location: 'Templo Principal',
                  frequency: 'Semanal',
                },
                { 
                  title: 'Culto de Oração', 
                  time: 'Quarta, 19:30 - 21:00',
                  location: 'Templo Principal',
                  frequency: 'Semanal',
                },
                { 
                  title: 'Estudo Bíblico', 
                  time: 'Sexta, 19:30 - 21:00',
                  location: 'Sala de Estudos',
                  frequency: 'Semanal',
                },
              ].map((event, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 mr-3">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-white">{event.title}</span>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />{event.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1" />{event.location}
                      </span>
                    </div>
                  </div>
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-200">
                    {event.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <EventList
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onViewEvent={handleViewEvent}
        />
      </div>
      
      <Modal
        isOpen={isAddingEvent}
        onClose={() => {
          setIsAddingEvent(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? 'Editar Evento' : 'Novo Evento'}
        size="lg"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmitEvent({
            title: formData.get('title') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            description: formData.get('description') as string,
            location: formData.get('location') as string,
            budget: Number(formData.get('budget')) || undefined,
            status: formData.get('status') as Event['status'],
            organizer: formData.get('organizer') as string,
          });
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="form-label">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={selectedEvent?.title}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="startDate" className="form-label">Data de Início</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                defaultValue={selectedEvent?.startDate}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="form-label">Data de Término</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                defaultValue={selectedEvent?.endDate}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="form-label">Local</label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={selectedEvent?.location}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={selectedEvent?.status || 'planned'}
                className="form-input"
                required
              >
                <option value="planned">Planejado</option>
                <option value="ongoing">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="organizer" className="form-label">Organizador</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                defaultValue={selectedEvent?.organizer}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="budget" className="form-label">Orçamento</label>
              <input
                type="number"
                id="budget"
                name="budget"
                defaultValue={selectedEvent?.budget}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label">Descrição</label>
              <textarea
                id="description"
                name="description"
                defaultValue={selectedEvent?.description}
                className="form-input h-24"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAddingEvent(false);
                setSelectedEvent(null);
              }}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {selectedEvent ? 'Atualizar' : 'Criar'} Evento
            </button>
          </div>
        </form>
      </Modal>
      
      <Modal
        isOpen={isViewingEvent}
        onClose={() => {
          setIsViewingEvent(false);
          setSelectedEvent(null);
        }}
        title="Detalhes do Evento"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {selectedEvent.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data e Hora</p>
                  <div className="flex items-center mt-1">
                    <Calendar size={16} className="text-primary-500 mr-2" />
                    <span className="text-gray-800 dark:text-white">
                      {new Date(selectedEvent.startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock size={16} className="text-primary-500 mr-2" />
                    <span className="text-gray-800 dark:text-white">
                      {new Date(selectedEvent.startDate).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(selectedEvent.endDate).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Local</p>
                  <div className="flex items-center mt-1">
                    <MapPin size={16} className="text-primary-500 mr-2" />
                    <span className="text-gray-800 dark:text-white">{selectedEvent.location}</span>
                  </div>
                </div>
                
                {selectedEvent.organizer && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organizador</p>
                    <div className="flex items-center mt-1">
                      <Users size={16} className="text-primary-500 mr-2" />
                      <span className="text-gray-800 dark:text-white">{selectedEvent.organizer}</span>
                    </div>
                  </div>
                )}
                
                {selectedEvent.budget && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Orçamento</p>
                    <p className="text-gray-800 dark:text-white mt-1">
                      R$ {selectedEvent.budget.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedEvent.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</p>
                  <p className="text-gray-800 dark:text-white mt-1">{selectedEvent.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleEditEvent(selectedEvent)}
                className="btn btn-primary"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  setIsViewingEvent(false);
                  setSelectedEvent(null);
                }}
                className="btn btn-outline"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;