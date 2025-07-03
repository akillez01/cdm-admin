import {
    Check,
    Download,
    FileImage,
    FileSpreadsheet,
    FileText
} from 'lucide-react';
import React, { useState } from 'react';

interface ExportOptions {
  format: 'pdf' | 'xlsx' | 'csv' | 'png';
  period: '7d' | '30d' | '3m' | '6m' | '1y' | 'custom';
  reportType: 'finance' | 'members' | 'inventory' | 'events' | 'complete';
  includeCharts: boolean;
  customDateRange?: {
    start: Date;
    end: Date;
  };
}

interface ReportExporterProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting?: boolean;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ 
  onExport, 
  isExporting = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    period: '30d',
    reportType: 'complete',
    includeCharts: true
  });

  const formatOptions = [
    { 
      value: 'pdf', 
      label: 'PDF', 
      icon: <FileText className="w-4 h-4" />,
      description: 'Documento formatado para impressão'
    },
    { 
      value: 'xlsx', 
      label: 'Excel', 
      icon: <FileSpreadsheet className="w-4 h-4" />,
      description: 'Planilha editável'
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: <FileSpreadsheet className="w-4 h-4" />,
      description: 'Dados tabulares simples'
    },
    { 
      value: 'png', 
      label: 'Imagem', 
      icon: <FileImage className="w-4 h-4" />,
      description: 'Gráficos em imagem'
    }
  ];

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const reportTypes = [
    { value: 'finance', label: 'Relatório Financeiro', description: 'Dízimos, ofertas e despesas' },
    { value: 'members', label: 'Relatório de Membros', description: 'Estatísticas de membros' },
    { value: 'inventory', label: 'Relatório de Inventário', description: 'Estoque e itens' },
    { value: 'events', label: 'Relatório de Eventos', description: 'Eventos e participação' },
    { value: 'complete', label: 'Relatório Completo', description: 'Todos os dados consolidados' }
  ];

  const handleExport = async () => {
    try {
      await onExport(exportOptions);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro na exportação:', error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        Exportar Relatório
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Download className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Exportar Relatório</h3>
              <p className="text-sm text-gray-600">Configure as opções de exportação</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formato de Exportação
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportOptions(prev => ({ 
                    ...prev, 
                    format: format.value as 'pdf' | 'xlsx' | 'csv' | 'png'
                  }))}
                  className={`
                    p-3 border-2 rounded-lg text-left transition-all
                    ${exportOptions.format === format.value 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {format.icon}
                    <span className="font-medium">{format.label}</span>
                    {exportOptions.format === format.value && (
                      <Check className="w-4 h-4 text-primary-600 ml-auto" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">{format.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Relatório
            </label>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all
                    ${exportOptions.reportType === type.value 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={exportOptions.reportType === type.value}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      reportType: e.target.value as 'finance' | 'members' | 'inventory' | 'events' | 'complete'
                    }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Período
            </label>
            <select
              value={exportOptions.period}
              onChange={(e) => setExportOptions(prev => ({ 
                ...prev, 
                period: e.target.value as '7d' | '30d' | '3m' | '6m' | '1y' | 'custom'
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {periodOptions.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Opções Adicionais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Opções Adicionais
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    includeCharts: e.target.checked 
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Incluir Gráficos</div>
                  <div className="text-sm text-gray-600">Adicionar visualizações gráficas no relatório</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportExporter;
