const Card = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
};

export default Card;
