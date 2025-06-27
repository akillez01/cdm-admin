import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Package,
  PiggyBank,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSupabase } from "../hooks/useSupabase";
import { Member } from '../types';

// Cores consistentes para os gráficos
const COLORS = ["#003B4D", "#D4AF37", "#185A6D", "#B39020"];

interface DashboardMetrics {
  activeMembers: number;
  upcomingEvents: number;
  monthlyRevenue: number;
  foodBaskets: number;
}

// Componente de Loading Spinner simples
const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-t-2 border-b-2 border-primary-500`}></div>
  );
};

const Dashboard: React.FC = () => {
  const { getMembers, getTransactions, getInventory, supabase } = useSupabase();
  const [members, setMembers] = useState<Member[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeMembers: 0,
    upcomingEvents: 0,
    monthlyRevenue: 0,
    foodBaskets: 0
  });
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<{name: string, value: number}[]>([]);
  const [offeringData, setOfferingData] = useState<{name: string, value: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const membersData = await getMembers();
        setMembers(membersData);

        // Busca membros, transações e inventário
        const [transactions, inventory] = await Promise.all([
          getTransactions(),
          getInventory()
        ]);

        // Buscar eventos futuros
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gte('start_date', new Date().toISOString());
        if (eventsError) throw eventsError;

        // Processar dados para métricas
        const activeMembers = membersData.filter(m => m.status === 'active').length;
        const monthlyRevenue = transactions
          .filter((t: Database['public']['Tables']['transactions']['Row']) => t.type !== "expense")
          .reduce((sum: number, t: Database['public']['Tables']['transactions']['Row']) => sum + Number(t.amount), 0);
        // Contar cestas básicas no inventário
        const foodBaskets = (inventory as Database['public']['Tables']['inventory_items']['Row'][])
          .filter(item => item.category?.toLowerCase().includes('cesta'))
          .reduce((sum, item) => sum + (item.quantity || 0), 0);

        // Gerar dados para gráficos
        const months = generateMonthLabels();
        const attendance = generateAttendanceData(months);
        const offerings = generateOfferingData(months, transactions as Database['public']['Tables']['transactions']['Row'][]);

        setMetrics({
          activeMembers,
          upcomingEvents: eventsData ? eventsData.length : 0,
          monthlyRevenue,
          foodBaskets
        });
        setAttendanceData(attendance);
        setOfferingData(offerings);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getMembers, getTransactions, getInventory, supabase]);

  const generateMonthLabels = () => {
    return Array.from({ length: 9 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (8 - i));
      return date.toLocaleString("pt-BR", { month: "short" });
    });
  };

  const generateAttendanceData = (months: string[]) => {
    return months.map(name => ({
      name,
      value: Math.floor(Math.random() * 100) + 140 // Dados mockados
    }));
  };

  const generateOfferingData = (months: string[], transactions: Database['public']['Tables']['transactions']['Row'][]) => {
    return months.map((name, i) => ({
      name,
      value: transactions
        .filter(t => t.category === "Dízimo" || t.category === "Oferta")
        .filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === new Date().getMonth() - (8 - i);
        })
        .reduce((sum, t) => sum + Number(t.amount), 0)
    }));
  };

  const ministryData = [
    { name: "Louvor", value: 35 },
    { name: "Jovens", value: 28 },
    { name: "Crianças", value: 22 },
    { name: "Missões", value: 15 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 sm:p-6">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 font-display">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Visão geral da igreja e métricas importantes
        </p>
      </header>

      {/* Cards principais com métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mb-6 sm:mb-8">
        <MetricCard 
          title="Membros Ativos"
          value={metrics.activeMembers}
          change="+12% este mês"
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
          iconBg="bg-primary-100 dark:bg-primary-800"
          iconColor="text-primary-600 dark:text-primary-300"
          trend="up"
        />
        
        <MetricCard 
          title="Próximos Trabalhos"
          value={metrics.upcomingEvents}
          change="3 esta semana"
          icon={<CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />}
          iconBg="bg-blue-100 dark:bg-blue-800"
          iconColor="text-blue-600 dark:text-blue-300"
        />
        
        <MetricCard 
          title="Receita Mensal"
          value={`R$ ${metrics.monthlyRevenue.toLocaleString('pt-BR')}`}
          change="-3% em relação a agosto"
          icon={<PiggyBank className="w-5 h-5 sm:w-6 sm:h-6" />}
          iconBg="bg-yellow-100 dark:bg-yellow-800"
          iconColor="text-yellow-600 dark:text-yellow-300"
          trend="down"
        />
        
        <MetricCard 
          title="Cestas Básicas"
          value={`${metrics.foodBaskets}/50`}
          change="90% da meta"
          icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
          iconBg="bg-amber-100 dark:bg-amber-800"
          iconColor="text-amber-600 dark:text-amber-300"
          trend="up"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <ChartCard 
          title="Frequência nos Trabalhos"
          description="Dados dos últimos 9 meses"
          chart={
            <LineChartComponent 
              data={attendanceData} 
              color="#003B4D"
            />
          }
        />
        
        <ChartCard 
          title="Mensalidades e contribuições"
          description="Valores em Reais (R$)"
          chart={
            <LineChartComponent 
              data={offeringData} 
              color="#D4AF37"
              tooltipFormatter={(value) => `R$ ${value}`}
            />
          }
        />
      </div>

      {/* Metas e Ministérios */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div>
          <GoalsCard />
        </div>
        {/* Painel de Informações da Igreja */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-primary-200 flex items-center">
            <span className="mr-2">Administração da Igreja</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary-600 dark:text-primary-300">Equipe Administrativa</h3>
              <ul className="space-y-2">
                {/* Exemplo: buscar membros admins do banco */}
                {members.filter(m => m.status === 'active' && m.ministries?.includes('Administração')).map(admin => (
                  <li key={admin.id} className="flex items-center space-x-3">
                    <img src={admin.photo || 'https://randomuser.me/api/portraits/men/1.jpg'} alt={admin.firstName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">{admin.firstName} {admin.lastName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">{admin.email}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">Cargo: {admin.skills?.join(', ') || 'Administrador'}</div>
                    </div>
                  </li>
                ))}
                {members.filter(m => m.status === 'active' && m.ministries?.includes('Administração')).length === 0 && (
                  <li className="text-gray-500 dark:text-gray-400">Nenhum membro administrativo cadastrado.</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary-600 dark:text-primary-300">Contatos</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Telefone:</span> (11) 99999-9999
                </div>
                <div>
                  <span className="font-medium">Email:</span> contato@igrejaexemplo.com
                </div>
                <div>
                  <span className="font-medium">Endereço:</span> Rua Caravelle, 123 - Taruma, Manaus/AM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares para melhor organização

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: 'up' | 'down';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  iconBg, 
  iconColor,
  trend 
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
        <div className={`p-2 sm:p-3 rounded-full ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {value}
          </div>
          <div className={`flex items-center text-xs ${trendColor} mt-1`}>
            {trend === 'up' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChartCardProps {
  title: string;
  description: string;
  chart: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, chart }) => (
  <Card>
    <CardContent className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {description}
      </p>
      <div className="h-[250px] sm:h-[300px]">
        {chart}
      </div>
    </CardContent>
  </Card>
);

interface LineChartComponentProps {
  data: {name: string, value: number}[];
  color: string;
  tooltipFormatter?: (value: number) => string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ 
  data, 
  color,
  tooltipFormatter
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart 
      data={data} 
      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis 
        dataKey="name" 
        tick={{ fill: '#6b7280', fontSize: 12 }} 
        axisLine={false}
      />
      <YAxis 
        tick={{ fill: '#6b7280', fontSize: 12 }} 
        axisLine={false}
        width={30}
      />
      <Tooltip 
        formatter={(value) => [
          tooltipFormatter ? tooltipFormatter(Number(value)) : value, 
          "Valor"
        ]}
        contentStyle={{
          fontSize: '12px',
          borderRadius: '8px',
          padding: '6px 10px'
        }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 5 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

interface PieChartComponentProps {
  data: {name: string, value: number}[];
  colors: string[];
  tooltipFormatter?: (value: number) => string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ 
  data, 
  colors,
  tooltipFormatter
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={70}
        innerRadius={30}
        paddingAngle={5}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip 
        formatter={(value) => [
          tooltipFormatter ? tooltipFormatter(Number(value)) : value, 
          "Total"
        ]}
        contentStyle={{
          fontSize: '12px',
          borderRadius: '8px',
          padding: '6px 10px'
        }}
      />
    </PieChart>
  </ResponsiveContainer>
);

const GoalsCard: React.FC = () => {
  const goals = [
    { name: "Novos Membros", current: 15, target: 20 },
    { name: "Orçamento Mensal", current: 22450, target: 25000, isCurrency: true },
    { name: "Participantes", current: 310, target: 400 },
    { name: "Cestas Básicas Distribuídas", current: 45, target: 50 }
  ];

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
          Metas do Mês
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Progresso atual
        </p>
        <div className="space-y-3 sm:space-y-4">
          {goals.map((goal, index) => {
            const progress = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={index} className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {goal.name}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">
                    {goal.isCurrency 
                      ? `R$ ${goal.current.toLocaleString('pt-BR')}/${goal.target.toLocaleString('pt-BR')}`
                      : `${goal.current}/${goal.target}`}
                  </span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-1 sm:h-2"
                  indicatorColor={progress > 75 ? "bg-green-500" : progress > 50 ? "bg-yellow-500" : "bg-red-500"}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;