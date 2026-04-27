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
      <div className="rounded-3xl border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-xl font-semibold tracking-tight">
          Budget Breakdown
        </h3>

        <div className="mt-5 space-y-4 text-sm">
          {totalBudgets.map((item) => (
            <div key={item.category} className="flex justify-between gap-4">
              <span className="capitalize text-muted-foreground">
                {item.category}
              </span>

              <span className="font-medium">
                {formatMoney(item.total_cost)}
              </span>
            </div>
          ))}

          <div className="flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>{formatMoney(totalBudget)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BudgetBreakdown;
