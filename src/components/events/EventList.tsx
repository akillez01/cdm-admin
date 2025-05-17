import { Calendar, Clock, MapPin, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Event } from '../../types';

interface EventListProps {
  events: Event[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onViewEvent: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onViewEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para validar se uma string de data é válida
  const isValidDate = (dateString: string | null | undefined): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Formatação de data com tratamento de erro
  const formatDate = (dateString: string | null | undefined): string => {
    if (!isValidDate(dateString)) return "Data inválida";
    
    const date = new Date(dateString!);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Formatação de hora com tratamento de erro
  const formatTime = (dateString: string | null | undefined): string => {
    if (!isValidDate(dateString)) return "Horário inválido";
    
    const date = new Date(dateString!);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'planned':
        return 'badge-info';
      case 'ongoing':
        return 'badge-success';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planejado';
      case 'ongoing':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
            Eventos
          </h2>
          <button
            onClick={onAddEvent}
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Evento
          </button>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">Todos os Status</option>
              <option value="planned">Planejados</option>
              <option value="ongoing">Em Andamento</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            // Verifica se as datas são válidas antes de renderizar
            const hasValidDates = isValidDate(event.startDate) && isValidDate(event.endDate);
            
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {event.title}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-2 text-primary-500" />
                      {hasValidDates ? (
                        <>
                          <span>{formatDate(event.startDate)}</span>
                          {formatDate(event.startDate) !== formatDate(event.endDate) && (
                            <span> até {formatDate(event.endDate)}</span>
                          )}
                        </>
                      ) : (
                        <span>Datas inválidas</span>
                      )}
                    </div>
                    
                    {hasValidDates && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={16} className="mr-2 text-primary-500" />
                        <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={16} className="mr-2 text-primary-500" />
                      <span>{event.location}</span>
                    </div>
                    
                    {event.organizer && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Organizador:</span> {event.organizer}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => onViewEvent(event)}
                      className="text-primary-500 hover:text-primary-600 mr-3"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => onEditEvent(event)}
                      className="text-secondary-500 hover:text-secondary-600"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum evento encontrado com os filtros atuais.
            </p>
          </div>
        )}
      </div>
      
      {filteredEvents.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium">{filteredEvents.length}</span> de{' '}
            <span className="font-medium">{events.length}</span> eventos
          </div>
          
          <div className="flex space-x-1">
            <button
              disabled
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-50"
            >
              Anterior
            </button>
            <button className="px-3 py-1 bg-primary-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;