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

const COLORS = ["#003B4D", "#D4AF37", "#185A6D", "#B39020"];

const Dashboard: React.FC = () => {
  const { getMembers, getTransactions } = useSupabase();
  const [user] = useState({ name: "Admin" });
  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setMembers(await getMembers());
      setTransactions(await getTransactions());
      setLoading(false);
    }
    fetchData();
  }, [getMembers, getTransactions]);

  // Gráficos
  const months = Array.from({ length: 9 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (8 - i));
    return date.toLocaleString("pt-BR", { month: "short" });
  });

  const attendanceData = months.map((name, i) => ({
    name,
    value: Math.floor(Math.random() * 100) + 140,
  }));

  const offeringData = months.map((name, i) => ({
    name,
    value: transactions
      .filter((t) => t.category === "Dízimo" || t.category === "Oferta")
      .filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === new Date().getMonth() - (8 - i);
      })
      .reduce((sum, t) => sum + Number(t.amount), 0),
  }));

  const ministryData = [
    { name: "Louvor", value: 35 },
    { name: "Jovens", value: 28 },
    { name: "Crianças", value: 22 },
    { name: "Missões", value: 15 },
  ];

  // Layout do painel
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 font-display">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Visão geral da igreja e métricas importantes.
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-none border-0 bg-gradient-to-br from-primary-100 to-primary-300 dark:from-primary-900 dark:to-primary-800">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-3 rounded-full bg-primary-200 dark:bg-primary-700">
              <Users size={32} className="text-primary-700 dark:text-primary-200" />
            </div>
            <div>
              <div className="text-sm text-primary-900 dark:text-primary-200 font-medium">
                Membros Ativos
              </div>
              <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                {members.length}
              </div>
              <div className="flex items-center text-xs text-green-700 mt-1">
                <ChevronUp size={14} />
                <span>12% este mês</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-0 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-800">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-700">
              <CalendarDays size={32} className="text-blue-700 dark:text-blue-200" />
            </div>
            <div>
              <div className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                Eventos Próximos
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                8
              </div>
              <div className="flex items-center text-xs text-blue-700 mt-1">
                <CalendarDays size={14} className="mr-1" />
                <span>3 esta semana</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-0 bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900 dark:to-yellow-800">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-3 rounded-full bg-yellow-200 dark:bg-yellow-700">
              <PiggyBank size={32} className="text-yellow-700 dark:text-yellow-200" />
            </div>
            <div>
              <div className="text-sm text-yellow-900 dark:text-yellow-200 font-medium">
                Receita Mensal
              </div>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                R${" "}
                {transactions
                  .filter((t) => t.type !== "expense")
                  .reduce((sum, t) => sum + Number(t.amount), 0)
                  .toLocaleString("pt-BR")}
              </div>
              <div className="flex items-center text-xs text-red-700 mt-1">
                <ChevronDown size={14} />
                <span>3% em relação a agosto</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-0 bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-800">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-3 rounded-full bg-amber-200 dark:bg-amber-700">
              <Package size={32} className="text-amber-700 dark:text-amber-200" />
            </div>
            <div>
              <div className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                Cestas Básicas Distribuídas
              </div>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                45/50
              </div>
              <div className="flex items-center text-xs text-amber-700 mt-1">
                <ChevronUp size={14} />
                <span>90% da meta</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e cards de metas/ministérios - mantém igual ao seu código */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <div className="mb-2 font-semibold text-lg">Frequência nos Cultos</div>
            <div className="text-sm text-gray-500 mb-2">Dados dos últimos 9 meses</div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#003B4D"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-2 font-semibold text-lg">Dízimos e Ofertas</div>
            <div className="text-sm text-gray-500 mb-2">Valores em Reais (R$)</div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={offeringData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#D4AF37"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <div className="mb-2 font-semibold text-lg">Metas do Mês</div>
              <div className="text-sm text-gray-500 mb-2">Progresso atual</div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Novos Membros</span>
                    <span className="text-sm font-medium">15/20</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Orçamento Mensal</span>
                    <span className="text-sm font-medium">R$ 22.450/25.000</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Participantes em Eventos</span>
                    <span className="text-sm font-medium">310/400</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cestas Básicas Distribuídas</span>
                    <span className="text-sm font-medium">45/50</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <div className="mb-2 font-semibold text-lg">Distribuição por Ministérios</div>
            <div className="text-sm text-gray-500 mb-2">Participação ativa</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ministryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {ministryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pessoas`, "Total"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;