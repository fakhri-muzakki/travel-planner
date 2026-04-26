import { formatMoney } from "../_lib/formatters";

interface TotalBudget {
  category: string;
  total_cost: number;
}

interface BudgetBreakdownProps {
  totalBudgets: TotalBudget[];
  totalBudget: number;
}

const BudgetBreakdown = ({
  totalBudgets,
  totalBudget,
}: BudgetBreakdownProps) => {
  return (
    <aside className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
        <h3 className="text-xl font-semibold">Budget Breakdown</h3>

        <div className="mt-5 space-y-4 text-sm">
          {totalBudgets.map((item) => (
            <div key={item.category} className="flex justify-between">
              <span className="capitalize text-white/55">{item.category}</span>

              <span>{formatMoney(item.total_cost)}</span>
            </div>
          ))}

          <div className="flex justify-between border-t border-white/10 pt-4 font-semibold">
            <span>Total</span>
            <span>{formatMoney(totalBudget)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BudgetBreakdown;
