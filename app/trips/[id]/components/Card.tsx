const Card = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-white/50">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
};

export default Card;
